# K8sProject

K8sProject is a collaborative tool for managing software projects, providing to development teams an unique work environment with all the necessary tools for their work.

He included tools are necessary for development work, not to deploy.

What K8sProject provide insted downloading these tools? In addition to an integrated develop environment, your will get all these tools configured and prepared to work with each other.

Tools included:
- **Keycloak**. The users of all applications will be centralized in this tool.
- **GitBucket**. System control versions for git.
- **Jenkins**. CI/CD of projects. 
- **Wiki-js**. Collaborative documentation.
- **Nexus**. Storage of generated artifacts (js, jar, war...)
- **SonarQube**. Quality scanning tool.
- **Open Project**. Boards and issue for projects.
- **Mattermost**. Chat for the team.
- **Testlink**. Test manager.
- **Minio**. Storage of files.
- **RoundCube**. Email client.
- **Bootsnote**. Notes.

If do you need an environment for developers with a Continous Development tool integrated in git repository, linked with several tools, this is your framework work.


## Pre-conditions

K8sProject need a Kubernetes to be used. It can be an empty installation of k8s or an installation of k8s with already deployed software. K8sProject is not invasive with previous installations.

- The file `$HOME/.kube.config` must be exists.
- The state of k8s cluste must be running. Note: We use `kubectl cluster-info`.

## Testing it in local

If you want test K8sProject in your laptop, you can use Microk8s. [Doc](https://microk8s.io/docs/). 

This script: `sudo ./microk8s-setupsh` prepare your laptop befor execute K8sProject.

### Docker.
If you already have installed docker, you need add the following lines to `/etc/docker/daemon.json`: 
```
{
    "insecure-registries" : ["localhost:32000"] 
}
```
and then restart docker with: `sudo systemctl restart docker`

### Dashboard
If you need access the dashboard of microk8s, [check here](https://microk8s.io/docs/addon-dashboard).

### Ingress
If you have this problem in microk8s.ingress: `dial tcp: lookup xxx on 10.255.255.1:53: no such host` , edit `/etc/hosts` and add `XXX 127.0.0.1`


## Roadmap
- Windows installation.
- Postwoman tool.