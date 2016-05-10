"use strict";

var json = { gender : "male",
	birthdate : "1985-10-18",
	birthplace : "84007" }

var jsonNg = { birthdate : "1985-10-18",
	birthplace : "84007" }

var jsonNbd = { gender : "male",
	birthplace : "84007" }

var jsonNbp = { gender : "male",
	birthdate : "1985-10-18" }

var test = require("tape");

var idpToNir = require('../services/idpToNirService');

test('', function (t)
{
	t.deepEqual(idpToNir(json), "1851084007", "idpToNir c est ok");
	t.throws(idpToNir.bind(null, null), "null c ok");
	t.throws(idpToNir.bind(null, undefined), "undefined c ok");
	t.throws(idpToNir.bind(null, ""), "vide c ok");
	t.throws(idpToNir.bind(null, jsonNg), "jsonNg c ok");
	t.throws(idpToNir.bind(null, jsonNbd), "jsonNbd c ok");
	t.throws(idpToNir.bind(null, jsonNbp), "jsonNbp c ok");
	t.end();
});
