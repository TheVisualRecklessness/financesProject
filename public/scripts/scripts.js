$("#push").click(()=>{
    $("#navBar").slideToggle();
});

$("#addCuenta").click(()=>{
    $("#addCuentaForm").slideToggle();
});

$("#ingresosBtn").click(()=> {
    if($("#ingresos").attr("hidden")) {
        $("#ingresos").removeAttr("hidden");
        $("#egresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#ingresos").attr("hidden", true);
    }
});

$("#egresosBtn").click(()=> {
    if($("#egresos").attr("hidden")) {
        $("#egresos").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#egresos").attr("hidden", true);
    }
});

$("#movimientosBtn").click(()=> {
    if($("#movements").attr("hidden")) {
        $("#movements").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#egresos").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#movements").attr("hidden", true);
    }
});

$("#cuentasBtn").click(()=> {
    if($("#cuentas").attr("hidden")) {
        $("#cuentas").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#egresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
    } else {
        $("#cuentas").attr("hidden", true);
    }
});

