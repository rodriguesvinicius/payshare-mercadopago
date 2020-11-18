const express = require("express")
const MercadoPago = require("mercadopago");
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require('./config/connection');
const { transaction } = require("./config/connection");
const { Connection } = require("pg");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(session({
    secret: "ApiMercadoPago",
    resave: true,
    saveUninitialized: true
}))

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-2420873145417982-090913-cd49a39f07f40445a3350c1240b25c00-320694647"
});

app.post("/createUser", (req, res) => {
    connection.insert({
        nameUser: req.body.nameUser,
        emailUser: req.body.emailUser,
        amount: 50.00
    }).into('Merchant')
        .then(() => {
            res.send("Usuario cadastrado com sucesso")
        }).catch((err) => {
            console.log(err)
        })
})

app.get("/teste", (req, res) => {
    var externalReference = 1600465370571
    connection.select().table('transaction')
        .where("externalReference", "=", externalReference.toString()).then((transaction) => {
            console.log(transaction)
        }).catch((err) => {
            console.log("ERROU" + err)
        })
})

app.get("/wallet/:id", (req, res) => {
    connection.select().table("Merchant")
        .where("idUser", "=", req.params.id).then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err);
        })
})

app.get("/pagar/:id/:valor", async (req, res) => {

    var dados = {}
    var trataDados = []
    var itemsPedido = []
    var idUsuario = null;
    var teste = [];

    console.log(req.params.id)
    await connection.select().table('Merchant')
        .where('idUser', '=', req.params.id)
        .then(async (usuario) => {
            if (usuario) {
                usuario.forEach(data => {
                    idUsuario = data.idUser
                    dados = {
                        items: [
                            item = {
                                id: 1,
                                title: "Adição de fundos",
                                quantity: 1,
                                currency_id: 'BRL',
                                unit_price: parseFloat(req.params.valor)
                            }
                        ],

                        payer: {
                            email: data.emailUser.toString()
                        },
                        //é o campo que vamos consultar quando o mercado pago mandar que  o pagamento foi concluido
                        external_reference: "" + Date.now(),

                        back_urls: {
                            "success": "https://mercadopagoapp.herokuapp.com",
                            "failure": "https://mercadopagoapp.herokuapp.com/falha",
                            "pending": "https://mercadopagoapp.herokuapp.com/pendente"
                        },
                        auto_return: "approved",

                    }
                });

                try {
                    await MercadoPago.preferences.create(dados).then(async (data) => {
                        var unit_price = 0;
                        var description = '';
                        var external_reference = null;
                        trataDados.push(dados)
                        trataDados.forEach(element => {
                            external_reference = element.external_reference
                            element.items.forEach(element => {
                                unit_price = element.unit_price
                                description = element.title
                            });
                        });
                        console.log("dwadawd" + external_reference)
                        console.log("itemsss" + unit_price)
                        teste.push(data)
                        teste.forEach(element2 => {
                            console.log(element2.body.init_point)
                        })
                        await connection.insert({
                            amount: unit_price,
                            status: 'pedding',
                            description: description,
                            externalReference: external_reference,
                            idUser: idUsuario
                        }).into('transaction')
                            .then(() => {
                                console.log("Transação criada com sucesso")
                            }).catch((err) => {
                                console.log(err)
                            })
                        
                        return res.redirect(data.body.init_point);
                    });

                } catch (error) {
                    return res.send(error.message)
                }

            } else {
                console.log("não foi poossivel achar o usuario")
            }
        }).catch((err) => {
            console.log(err)
        })


})

app.post("/not", (req, res) => {
    var id = req.query.id;

    setTimeout(() => {

        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(async (data) => {
            var pagamento = data.body.results[0];
            if (pagamento != undefined) {
                console.log(pagamento)
                await connection.select().table('transaction')
                    .where("externalReference", "=", pagamento.external_reference.toString()).then(async (transaction) => {
                        if (transaction) {
                            if (pagamento.status == "approved") {
                                var idUser = null;
                                transaction.forEach(data => {
                                    idUser = data.idUser
                                });
                                await connection.table('transaction').update({
                                    status: 'approved',
                                    paymentMethod: pagamento.payment_method_id,
                                    currencyId: pagamento.currency_id
                                }).where("externalReference", "=", pagamento.external_reference.toString()).then(async () => {
                                    await connection.table('Merchant')
                                        .where('idUser', "=", idUser)
                                        .increment('amount', pagamento.transaction_amount).then(() => {
                                            console.log("Transação atualizada com sucesso")
                                        }).catch((err) => {
                                            console.log(err)
                                        })

                                }).catch((err) => {
                                    console.log(err);
                                })
                            } else {
                                console.log("transação pendente")
                            }
                        }
                    }).catch((err) => {
                        console.log("ERROU" + err)
                    })
            } else {
                console.log("Pagamento não existe")
            }
            console.log(data)
        }).catch((err) => {
            console.log(err)
        })

    }, 20000);

    res.send("OK");
})

const PORT = process.env.PORT || 8081

app.listen(PORT, (req, res) => {
    console.log("Servidor rodando")
})