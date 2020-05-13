#!/bin/bash
set -x

echo "Running installtools with parameters $*"

INGRESS_MICRO_K8S=$(kubectl -n ingress get pods|grep nginx-ingress-microk8s-controller|wc -l)
INGRESS_IP=$(kubectl get configMap --namespace k8s-project k8s-project-config -o jsonpath='{.data.INGRESS_IP}')
POSTGRES_PASSWORD=$(kubectl get --namespace k8s-project secrets/k8s-project-postgresql -o jsonpath='{.data.postgresql-password}'|base64 -d)

case $1 in
    k8s-project-keycloak)
    echo "Installing keycloak"
    helm repo add codecentric https://codecentric.github.io/helm-charts
    helm repo update
    helm install k8s-project-keycloak codecentric/keycloak --namespace k8s-project --set keycloak.username=$2 --set keycloak.password=$3 --set keycloak.persistence.dbPassword=$POSTGRES_PASSWORD -f ./back/config/keycloak_values.yml
    if test `echo $INGRESS_MICRO_K8S` -eq 0; then
      kubectl apply -f ./back/ingress/k8s/keycloak.yml
    else
      kubectl apply -f ./back/ingress/microk8s/keycloak.yml
    fi
    ;;

    k8s-project-gitbucket)
    echo "Installing gitbucket"
    helm repo add dmartinlozano https://dmartinlozano.github.io/helm-charts/
    helm repo update

cat <<-EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: k8s-project-config
  namespace: k8s-project
data:
  GITBUCKET_CONF: |
    oidc.client_secret=gitbucket
    oidc.issuer=http\://$INGRESS_IP/auth/realms/master
    oidc_authentication=true
    oidc.client_id=gitbucket
    oidc.jws_algorithm=RS256
    base_url=https\://$INGRESS_IP/gitbucket
EOF

    helm install k8s-project-gitbucket dmartinlozano/gitbucket --namespace k8s-project --set gitbucket.base_url="https://$INGRESS_IP/gitbucket" --set  externalDatabase.password=$POSTGRES_PASSWORD --set externalDatabase.user=k8sproject -f ./back/config/gitbucket_values.yml
    if test `echo $INGRESS_MICRO_K8S` -eq 0; then
      kubectl apply -f ./back/ingress/k8s/gitbucket.yml
    else
      kubectl apply -f ./back/ingress/microk8s/gitbucket.yml
    fi
    ;;

    k8s-project-jenkins)
    echo "Installing jenkins"

cat > /tmp/jenkins_helm_values.yml << EOF
master:
  useSecurity: true
  overwritePlugins: true
  installPlugins:
    - git:latest
    - keycloak:latest
    - matrix-auth:latest
  csrf:
    DefaultCrumbIssuer:
      Enabled: true
      ProxyCompatability: true
  JCasC:
    enabled: true
    pluginVersion: "1.32"
    configScripts:
      ldap-settings: |
        jenkins:
          securityRealm: keycloak
        unclassified:
          keycloakSecurityRealm:
            keycloakJson: |
              {
                "realm": "master",
                "auth-server-url": "https://$INGRESS_IP/auth",
                "ssl-required": "external",
                "resource": "jenkins",
                "credentials": {
                  "secret": "jenkins"
                },
                "confidential-port": 0
              }
EOF
    helm repo update
    helm install k8s-project-jenkins stable/jenkins --namespace k8s-project --set master.jenkinsUriPrefix="/jenkins" --set master.adminUser=root --set master.adminPassword=root -f /tmp/jenkins_helm_values.yml
    if test `echo $INGRESS_MICRO_K8S` -eq 0; then
      kubectl apply -f ./back/ingress/k8s/jenkins.yml
    else
      kubectl apply -f ./back/ingress/microk8s/jenkins.yml
    fi
    ;;

    k8s-project-wiki-js)
    echo "Installing wiki.js"
    helm repo add dmartinlozano https://dmartinlozano.github.io/helm-charts/
    helm repo update
    helm install k8s-project-wiki-js dmartinlozano/wiki-js --namespace k8s-project --set database.password=$POSTGRES_PASSWORD --set fixWizardAndKeycloakSidecar.wikiConfig.adminEmail=admin@example.com --set fixWizardAndKeycloakSidecar.wikiConfig.adminPassword=admin1234 --set fixWizardAndKeycloakSidecar.wikiConfig.siteUrl=http://$INGRESS_IP/wiki-js --set fixWizardAndKeycloakSidecar.keycloak.host=$INGRESS_IP -f ./back/config/wikijs_values.yml
    if test `echo $INGRESS_MICRO_K8S` -eq 0; then
      kubectl apply -f ./back/ingress/k8s/wikijs.yml
    else
      kubectl apply -f ./back/ingress/microk8s/wikijs.yml
    fi
    ;;

    k8s-project-testlink)
    echo "Installing testlink"
    helm repo add dmartinlozano https://dmartinlozano.github.io/helm-charts/
    helm repo update
    helm install k8s-project-testlink dmartinlozano/testlink  --namespace k8s-project --set externalDatabase.password=$POSTGRES_PASSWORD -f ./back/config/testlink_values.yml
    if test `echo $INGRESS_MICRO_K8S` -eq 0; then
      kubectl apply -f ./back/ingress/k8s/testlink.yml
    else
      kubectl apply -f ./back/ingress/microk8s/testlink.yml
    fi
    ;;

    *)
    echo "Ignoring $key"
    ;;
esac