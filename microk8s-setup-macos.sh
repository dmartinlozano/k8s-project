#!/bin/bash

#previous mac tools
IPROUTE2MAC=$(brew list|grep iproute2mac|wc -l)
KUBECTL=$(brew list|grep kubernetes-cli|wc -l)

if test `echo $KUBECTL` -eq 0; then
    brew install kubernetes-cli
fi

if test `echo $IPROUTE2MAC` -eq 0; then
    brew install iproute2mac
fi

#configure microk8s-vm with multipass

mkdir -p $HOME/.kube/

multipass launch --name microk8s-vm --mem 4G --disk 40G

multipass exec microk8s-vm -- sudo snap install microk8s --classic --channel=1.18/stable
multipass exec microk8s-vm -- sudo iptables -P FORWARD ACCEPT

multipass exec microk8s-vm -- sudo /snap/bin/microk8s.config > $HOME/.kube/config

#metallb
IP_ADDR="$(ip route get 8.8.8.8 |awk '{print $7}')"
REG=$(echo $IP_ADDR|cut -d "." -f1-3)
echo $REG.50-$REG.100|multipass exec microk8s-vm -- sudo microk8s.enable metallb
multipass exec microk8s-vm -- sudo microk8s.status --wait-ready

multipass exec microk8s-vm -- sudo microk8s.enable helm3 dns storage registry dashboard
multipass exec microk8s-vm -- sudo microk8s.status --wait-ready

chmod +x ./back/*.sh

echo 
echo "k8s installed ok with microk8s"
echo
echo "To view the token: kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)"
echo "To open dashboard: kubectl proxy --accept-hosts=.* --address=0.0.0.0"
echo
IP=$(multipass info microk8s-vm | grep IPv4 | awk '{ print $2 }')
echo "Dashboard url: http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#/login"



#multipass stop microk8s-vm
#multipass delete microk8s-vm
#multipass purge



