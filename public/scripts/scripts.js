$("#push").click(()=>{
    $("#navBar").slideToggle();
});

$("#ingresosBtn").click(()=> {
    if($("#ingresos").attr("hidden")) {
        $("#ingresos").removeAttr("hidden");
        $("#egresos").attr("hidden","hidden");
    } else {
        $("#ingresos").attr("hidden","hidden");
    }
});

$("#egresosBtn").click(()=> {
    if($("#egresos").attr("hidden")) {
        $("#egresos").removeAttr("hidden");
        $("#ingresos").attr("hidden","hidden");
    } else {
        $("#egresos").attr("hidden","hidden");
    }
});