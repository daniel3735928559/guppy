function send_report()
{
    var data = window.__coverage__;
    console.log("A",data);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) console.log("DONE!",xmlHttp.responseText);
	else console.log("ONO",xmlHttp.readyState, xmlHttp.status);
    }
    xmlHttp.open("post", "/coverage/client"); 
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));
}
