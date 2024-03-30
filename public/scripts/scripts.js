$("#push").click(()=>{
    $("#littleNav").slideToggle();
});

$("#addCuenta").click(()=>{
    $("#addCuentaForm").slideToggle();
});

$(".ingresosBtn").click(()=> {
    if($("#ingresos").is(":hidden")) {
        $("#ingresos").show();
        $("#egresos").hide();
        $("#movements").hide();
        $("#cuentas").hide();
        $("#transferencias").hide();
        $("#resumen").hide();
    } else {
        $("#ingresos").hide();
    }
});

$(".egresosBtn").click(()=> {
    if($("#egresos").is(":hidden")) {
        $("#egresos").show();
        $("#ingresos").hide();
        $("#movements").hide();
        $("#cuentas").hide();
        $("#transferencias").hide();
        $("#resumen").hide();
    } else {
        $("#egresos").hide();
    }
});

$(".transferenciasBtn").click(()=> {
    if($("#transferencias").is(":hidden")) {
        $("#transferencias").show();
        $("#ingresos").hide();
        $("#egresos").hide();
        $("#movements").hide();
        $("#cuentas").hide();
        $("#resumen").hide();
    } else {
        $("#transferencias").hide();
    }
});

$(".movimientosBtn").click(()=> {
    if($("#movements").is(":hidden")) {
        $("#movements").show();
        $("#movements").css("display","flex");
        $("#ingresos").hide();
        $("#egresos").hide();
        $("#cuentas").hide();
        $("#transferencias").hide();
        $("#resumen").hide();
    } else {
        $("#movements").hide();
    }
});

$(".cuentasBtn").click(()=> {
    if($("#cuentas").is(":hidden")) {
        $("#cuentas").show();
        $("#ingresos").hide();
        $("#egresos").hide();
        $("#movements").hide();
        $("#transferencias").hide();
        $("#resumen").hide();
    } else {
        $("#cuentas").hide();
    }
});

$(".resumenBtn").click(()=> {
    if($("#resumen").is(":hidden")) {
        $("#resumen").show();
        $("#ingresos").hide();
        $("#egresos").hide();
        $("#movements").hide();
        $("#cuentas").hide();
        $("#transferencias").hide();
    } else {
        $("#resumen").hide();
    }
});

$("#push").click(()=>{
    if($("#littleIngresosBtn").css("display")=="none") {
        $("#littleNav").show().animate({ "right": "0" }, "fast" );
        $("#littleIngresosBtn").show();
        $("#littleIngresosBtn").css("display","block");
        $("#littleEgresosBtn").show();
        $("#littleEgresosBtn").css("display","block");
        $("#littleTransferenciasBtn").show();
        $("#littleTransferenciasBtn").css("display","block");
        $("#littleMovimientosBtn").show();
        $("#littleMovimientosBtn").css("display","block");
        $("#littleCuentasBtn").show();
        $("#littleCuentasBtn").css("display","block");
        $("#littleResumenBtn").show();
        $("#littleResumenBtn").css("display","block");
    } else {
        $("#littleNav").animate({ "right": "-=300px" }, "fast");
        $("#littleIngresosBtn").hide();
        $("#littleEgresosBtn").hide();
        $("#littleTransferenciasBtn").hide();
        $("#littleMovimientosBtn").hide();
        $("#littleCuentasBtn").hide();
        $("#littleResumenBtn").hide();
    }
});