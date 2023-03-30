const fetch = callback=>{
    const promise = new Promise((resolve,reject )=>{

        setTimeout(()=>{
            resolve('Done!');
        },1500);
    })
    return promise;
};


setTimeout(() => {
    console.log("timer check");
    fetch()
    .then(text => {
        console.log(text)
        return fetch();
    })
    .then(text2 =>{
        console.log(text2)
        return fetch();
    })
}, 1000);

// console.log("hi");
// console.log("why");
