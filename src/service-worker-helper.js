export default function ServiceWorkerHelper(){
    let serviceWorkerUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if('serviceWorker' in navigator){
        window.addEventListener('load', () =>{
            navigator.serviceWorker.register(serviceWorkerUrl).then(registration => {
                console.log("Service worker registration successfully.");
            }).catch(error => {
                console.log("Service worker registration failed.",error);
            })
        })
    }

}