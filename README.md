add-torrent
===========

Send magnet links or torrent URLs to a remote Transmission daemon in your browser or via HTTP.


Configuration
-------------

Set the following environment variables:

- `$TRANSMISSION_RPC_URL`: URL of your Transmission daemon's RPC interface,
  defaults to `http://localhost:9091/transmission/rpc/`.
- `$DOWNLOAD_DIRECTORIES`: array of `name:/my/directory,…` for torrent content
  to be moved to upon completion.
- `$PORT`: to serve from, defaults to `3000`.


Usage
-----

```bash
npm install
npm start
```

and open <http://localhost:3000/>.


### Command Line

Using [httpie](https://httpie.org/):

```bash
http post localhost:3000/ url='https://archive.org/download/flickr-ows-05-6503285175/flickr-ows-05-6503285175_archive.torrent'
# HTTP/1.1 201 Created
# Content-Type: application/json; charset=utf-8
# …
# ETag: 02234f9cb44ba1157473578ccc94cbbbb3be04fa
#
# {
#     "hashString": "02234f9cb44ba1157473578ccc94cbbbb3be04fa",
#     "id": 626,
#     "name": "flickr-ows-05-6503285175",
#     "url": "https://archive.org/download/flickr-ows-05-6503285175/flickr-ows-05-6503285175_archive.torrent"
# }
```


Build
-----

Via Docker:

```bash
docker build -t $DOCKER_USERNAME/add-torrent .
```


Deploy
------

### Kubernetes

To deploy on Kubernetes, we create a [ConfigMap][]
to hold our environment variables and then apply
the [provided YAML][kubernetes-yaml]
to your Kubernetes cluster:



```bash
kubectl create configmap add-torrent-config \
    --from-literal=transmission-rpc-url=$TRANSMISSION_RPC_URL \
    --from-literal=download-directories=$DOWNLOAD_DIRECTORIES
# configmap "add-torrent-config" created

kubectl apply -f kubernetes.yml
# deployment "add-torrent-deployment" created
# service "add-torrent-service" created
# ingress "add-torrent-ingress" created
```

The Kubernetes resource file contains:

- a Deployment to download and run the container,
  using the `add-torrent-config` ConfigMap for environment variables
- a Service to abstract between the deployment's pods and the ingress
- an Ingress (this one uses [`ingress-nginx`][ingress-nginx],
  so you should alter this for your environment)


[kubernetes-yaml]: ./kubernetes.yml
[ConfigMap]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/
[ingress-nginx]: https://github.com/kubernetes/ingress-nginx/
