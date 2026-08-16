# Deploying the sentiment-analyzer as a serverless microservice on IBM Code Engine

The sentiment-analyzer is designed as a **stateless, scale-to-zero** serverless
microservice. It does not hold state and can be invoked on demand, which makes it
a perfect fit for IBM Code Engine.

## Prerequisites

- [IBM Cloud account](https://cloud.ibm.com)
- IBM Cloud CLI with the Code Engine plugin:

```bash
ibmcloud plugin install code-engine -f
ibmcloud login --sso
ibmcloud target -g <resource_group> -r <region>
```

## Option A — Build from a Docker image (Container Registry)

1. Create a namespace in IBM Cloud Container Registry and build/push the image:

```bash
ibmcloud cr namespace-add <namespace>
ibmcloud cr login

docker build -t <region>.icr.io/<namespace>/sentiment-analyzer:latest .
docker push <region>.icr.io/<namespace>/sentiment-analyzer:latest
```

2. Create/select a Code Engine project:

```bash
ibmcloud ce project create --name cardealer
ibmcloud ce project select --name cardealer
```

3. Deploy the application (scale-to-zero serverless):

```bash
ibmcloud ce application create \
  --name sentiment-analyzer \
  --image <region>.icr.io/<namespace>/sentiment-analyzer:latest \
  --port 5000 \
  --cpu 0.25 \
  --memory 0.5G \
  --min-scale 0 \
  --max-scale 1
```

> `--min-scale 0` makes the service scale down to zero instances when idle —
> you only pay when it is invoked.

4. Get the public URL and test it:

```bash
ibmcloud ce application get --name sentiment-analyzer
# URL looks like: https://sentiment-analyzer.<project>.<region>.codeengine.appdomain.cloud

curl -X POST https://sentiment-analyzer.<project>.<region>.codeengine.appdomain.cloud/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This car is amazing, I love it"}'
# -> {"sentiment":"positive"}
```

## Option B — Build directly from source with Code Engine

```bash
ibmcloud ce project select --name cardealer

ibmcloud ce build create \
  --name sentiment-analyzer-build \
  --build-type buildpacks \
  --source . \
  --output <region>.icr.io/<namespace>/sentiment-analyzer:latest \
  --push-secret <registry-secret>

ibmcloud ce application create \
  --name sentiment-analyzer \
  --image <region>.icr.io/<namespace>/sentiment-analyzer:latest \
  --port 5000 \
  --cpu 0.25 \
  --memory 0.5G \
  --min-scale 0 \
  --max-scale 1
```

## Wiring it into the rest of the app

The Django BFF calls `POST /analyze` with `{"text": "<review text>"}` and expects
`{"sentiment": "positive" | "negative" | "neutral"}`. Configure the BFF with:

```bash
export SENTIMENT_API_URL=https://sentiment-analyzer.<project>.<region>.codeengine.appdomain.cloud
```

## Local development

```bash
npm install
npm start          # listens on http://localhost:5000

curl -X POST localhost:5000/analyze -H "Content-Type: application/json" -d '{"text":"Great car!"}'
```
