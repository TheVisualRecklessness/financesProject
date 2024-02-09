$("#push").click(()=>{
    $("#littleNav").slideToggle();
});

$("#addCuenta").click(()=>{
    $("#addCuentaForm").slideToggle();
});

$(".ingresosBtn").click(()=> {
    if($("#ingresos").attr("hidden")) {
        $("#ingresos").removeAttr("hidden");
        $("#egresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#ingresos").attr("hidden", true);
    }
});

$(".egresosBtn").click(()=> {
    if($("#egresos").attr("hidden")) {
        $("#egresos").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#egresos").attr("hidden", true);
    }
});

$(".movimientosBtn").click(()=> {
    if($("#movements").attr("hidden")) {
        $("#movements").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#egresos").attr("hidden", true);
        $("#cuentas").attr("hidden", true);
    } else {
        $("#movements").attr("hidden", true);
    }
});

$(".cuentasBtn").click(()=> {
    if($("#cuentas").attr("hidden")) {
        $("#cuentas").removeAttr("hidden");
        $("#ingresos").attr("hidden", true);
        $("#egresos").attr("hidden", true);
        $("#movements").attr("hidden", true);
    } else {
        $("#cuentas").attr("hidden", true);
    }
});

// $("#push").click(()=>{
//     if($("#littleIngresosBtn").css("display")=="block") {
//         $("#littleNav").animate({ "right": "-=300px" }, "slow" );
//         $("#littleIngresosBtn").css("display","none");
//         $("#littleEgresosBtn").css("display","none");
//         $("#littleMovimientosBtn").css("display","none");
//         $("#littleCuentasBtn").css("display","none");
//     } else {
//         $("#littleIngresosBtn").css("display","block");
//         $("#littleEgresosBtn").css("display","block");
//         $("#littleMovimientosBtn").css("display","block");
//         $("#littleCuentasBtn").css("display","block");
//         $("#littleNav").animate({ "right": "+=300px" }, "slow" );
//     }
// }); 

$("#push").click(()=>{
    if($("#littleIngresosBtn").css("display")=="none") {
        $("#littleNav").show().animate({ "right": "0" }, "fast" );
        $("#littleIngresosBtn").show();
        $("#littleIngresosBtn").css("display","block");
        $("#littleEgresosBtn").show();
        $("#littleEgresosBtn").css("display","block");
        $("#littleMovimientosBtn").show();
        $("#littleMovimientosBtn").css("display","block");
        $("#littleCuentasBtn").show();
        $("#littleCuentasBtn").css("display","block");
    } else {
        $("#littleNav").animate({ "right": "-=300px" }, "fast");
        $("#littleIngresosBtn").hide();
        $("#littleEgresosBtn").hide();
        $("#littleMovimientosBtn").hide();
        $("#littleCuentasBtn").hide();
    }
});