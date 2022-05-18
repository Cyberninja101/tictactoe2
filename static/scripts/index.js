// redirect create game button and join game button to the correct url


function join() {
    var good_id = document.getElementsByName("game_id")[0].value;
    // This works too
    console.log("hi");
    console.log(good_id);
    console.log(good_id.value);
    console.log(location.href);
    window.location.pathname = "higoogle"
    // window.location.replace(window.location.href + id);



    // This part ain't working
    // var xhr = new XMLHttpRequest();
    // var url = "/" + str(id);
    // xhr.open(url, true);
    // // xhr.setRequestHeader();
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         var json = JSON.parse(xhr.responseText);
    //         console.log("Got it.");
    //     }
    // };
    // xhr.send(null);
    // console.log(data)
}