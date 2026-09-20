// ============================================================
// PORTÃO - NOTIFICAÇÕES COM SHELLY BLU DOOR/WINDOW
// ============================================================
// Shelly 1 Gen4
// Sensor: Shelly BLU Door/Window
// Comunicação: Bluetooth / BTHome
// Firmware: 2.0.0
//
// O script aguarda OPEN_DELAY segundos antes de confirmar
// uma alteração de estado.
//
// Isto evita falsos positivos causados por vibração,
// movimento ou oscilações do portão.
// ============================================================


// ============================================================
// CONFIGURAÇÃO
// ============================================================

// Tempo que o estado tem de permanecer estável
// antes de enviar a notificação.

const OPEN_DELAY = 5;


// ------------------------------------------------------------
// Notificações
// ------------------------------------------------------------

// true  = ativado
// false = desativado

const NOTIFY_OPEN  = true;
const NOTIFY_CLOSE = true;


// ------------------------------------------------------------
// ID DO SENSOR BLU
// ------------------------------------------------------------

// ID do componente BTHome correspondente ao estado
// Door/Window do sensor.
//
// No dispositivo usado para testar:
// bthomesensor:202

const SENSOR_ID = 202;


// ============================================================
// CONFIGURAÇÃO DA SHELLY CLOUD
// ============================================================

// Servidor Shelly Cloud

const CLOUD_SERVER = "https://O_TEU_SERVER.shelly.cloud";

// Authorization Cloud Key

const AUTH_KEY = "O_TEU_AUTH_KEY";

// ID da Scene que envia a notificação de ABERTURA

const SCENE_OPEN_ID = O_TEU_SCENE_OPEN_ID;

// ID da Scene que envia a notificação de FECHO

const SCENE_CLOSE_ID = O_TEU_SCENE_CLOSE_ID;


// ============================================================
// VARIÁVEIS INTERNAS
// ============================================================

let openTimer = null;
let closeTimer = null;


// ============================================================
// EXECUTAR SCENE DA SHELLY CLOUD
// ============================================================

function runScene(sceneId, description) {

    print("A enviar notificação: " + description);

    let url = CLOUD_SERVER +
        "/scene/manual_run" +
        "?auth_key=" + AUTH_KEY +
        "&id=" + sceneId;


    Shelly.call("HTTP.GET", {
        url: url
    }, function (result, error_code, error_message) {

        if (error_code === 0) {

            print(
                "Notificação enviada com sucesso: " +
                description
            );

        } else {

            print("ERRO ao enviar notificação!");
            print("Código: " + error_code);
            print("Mensagem: " + error_message);
        }
    });
}


// ============================================================
// MONITORIZAR SENSOR BLU
// ============================================================

Shelly.addStatusHandler(function (event) {

    if (
        event.component !==
        "bthomesensor:" + SENSOR_ID
    ) {
        return;
    }


    // Verificar se houve alteração do estado

    if (
        !event.delta ||
        event.delta.value === undefined
    ) {
        return;
    }


    let newState = event.delta.value;


    // ========================================================
    // SENSOR REPORTOU ABERTO
    // ========================================================

    if (newState === true) {

        print("Sensor BLU: PORTÃO ABERTO.");


        // Cancelar temporizador de FECHO

        if (closeTimer !== null) {

            Timer.clear(closeTimer);
            closeTimer = null;

            print("Temporizador de fecho cancelado.");
        }


        // Verificar se notificações de abertura estão ativas

        if (!NOTIFY_OPEN) {

            print(
                "Notificações de abertura desativadas."
            );

            return;
        }


        // Cancelar eventual temporizador anterior

        if (openTimer !== null) {

            Timer.clear(openTimer);
            openTimer = null;
        }


        print(
            "A aguardar " +
            OPEN_DELAY +
            " segundos para confirmar abertura..."
        );


        // Iniciar temporizador

        openTimer = Timer.set(
            OPEN_DELAY * 1000,
            false,
            function () {

                openTimer = null;

                let status = Shelly.getComponentStatus(
                    "bthomesensor:" + SENSOR_ID
                );


                if (
                    status &&
                    status.value === true
                ) {

                    print(
                        "Portão permaneceu ABERTO durante " +
                        OPEN_DELAY +
                        " segundos."
                    );


                    runScene(
                        SCENE_OPEN_ID,
                        "Portão aberto"
                    );

                } else {

                    print(
                        "Portão deixou de estar aberto antes dos " +
                        OPEN_DELAY +
                        " segundos."
                    );

                    print(
                        "Notificação de abertura cancelada."
                    );
                }
            }
        );
    }


    // ========================================================
    // SENSOR REPORTOU FECHADO
    // ========================================================

    else if (newState === false) {

        print("Sensor BLU: PORTÃO FECHADO.");


        // Cancelar temporizador de ABERTURA

        if (openTimer !== null) {

            Timer.clear(openTimer);
            openTimer = null;

            print("Temporizador de abertura cancelado.");
        }


        // Verificar se notificações de fecho estão ativas

        if (!NOTIFY_CLOSE) {

            print(
                "Notificações de fecho desativadas."
            );

            return;
        }


        // Cancelar eventual temporizador anterior

        if (closeTimer !== null) {

            Timer.clear(closeTimer);
            closeTimer = null;
        }


        print(
            "A aguardar " +
            OPEN_DELAY +
            " segundos para confirmar fecho..."
        );


        // Iniciar temporizador

        closeTimer = Timer.set(
            OPEN_DELAY * 1000,
            false,
            function () {

                closeTimer = null;

                let status = Shelly.getComponentStatus(
                    "bthomesensor:" + SENSOR_ID
                );


                if (
                    status &&
                    status.value === false
                ) {

                    print(
                        "Portão permaneceu FECHADO durante " +
                        OPEN_DELAY +
                        " segundos."
                    );


                    runScene(
                        SCENE_CLOSE_ID,
                        "Portão fechado"
                    );

                } else {

                    print(
                        "Portão deixou de estar fechado antes dos " +
                        OPEN_DELAY +
                        " segundos."
                    );

                    print(
                        "Notificação de fecho cancelada."
                    );
                }
            }
        );
    }
});
