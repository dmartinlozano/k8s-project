#!/bin/bash

set -x

multipass launch --name microk8s-vm --mem 4G --disk 40G

multipass exec microk8s-vm -- sudo snap install microk8s --classic --channel=1.18/stable
multipass exec microk8s-vm -- sudo iptables -P FORWARD ACCEPT
#multipass exec microk8s-vm -- mkdir -p /home/ubuntu/.kube/
#multipass exec microk8s-vm -- sudo chmod 777 /home/ubuntu/.kube/
#multipass exec microk8s-vm -- touch /home/ubuntu/.kube/config
#multipass exec microk8s-vm -- sudo microk8s.kubectl config view --raw > /home/ubuntu/.kube/config
multipass exec microk8s-vm -- sudo microk8s.enable helm3 dns storage dashboard registry
multipass exec microk8s-vm -- microk8s.status --wait-ready

multipass exec microk8s-vm -- sudo microk8s kubectl -n kube-system describe secret $(multipass exec microk8s-vm -- sudo microk8s kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)
multipass exec microk8s-vm -- sudo microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443 --address 0.0.0.0 &> /dev/null &
IP=$(multipass info microk8s-vm | grep IPv4 | awk '{ print $2 }')
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors https://$IP:10443 &> /dev/null &

#multipass stop microk8s-vm
#multipass delete microk8s-vm
#multipass purge



