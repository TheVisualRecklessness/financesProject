$("#push").click(()=>{
    $("#navBar").slideToggle();
});

$("#ingresosBtn").click(()=> {
    if($("#ingresos").attr("hidden")) {
        $("#ingresos").removeAttr("hidden");
    } else {
        $("#ingresos").attr("hidden","hidden");
    }
});