'use strict';

const expect = require('chai').expect;
const ChomageService = require('../chomage.service')
const sinon = require('sinon');

let experiences = [];
let debit = [];

describe('Chomage : allocation', () => {
  const service = new ChomageService()
  describe('quand l\'travailleur n\'a jamais pas travaillé', () => {
    it('il n\'a pas le droit au chomage', () => {

      const chomage = service.getAllocations(experiences, debit)

      expect(chomage.hasAccess).to.be.false
    })
  })

  describe('quand le travailleur a déjà un emploi', () => {
    it('il n\'a pas le droit au chomage', () => {
      experiences = [
         {
           "emploi": {
             "date": 2015,
             "debut": "2015-12-01",
             "fin": null,
           }
         }
       ]
      const chomage = service.getAllocations(experiences, debit)

      expect(chomage.hasAccess).to.be.false
    })
  })



  describe('quand le travailleur a travaillé', () => {
    describe('et qu\' il est resté dans la meme entreprise sur 2015', () => {

      beforeEach(() => {
        experiences = [
           {
             "emploi": {
               "date": 2015,
               "debut": "2015-12-01",
               "fin": "2015-12-31",
             }
           }
         ]
      })

      it('il a le droit au chomage', () => {

        const chomage = service.getAllocations(experiences, debit)

        expect(chomage.hasAccess).to.be.true
      })

      describe('quand le travailleur touche déjà le chomage', () => {
        it('il a pas le droit au chomdu', () => {
           debit = [
              {
                "date": 2016,
                "debut": "2016-12-01",
                "fin": "2016-12-31",
                "type": "ARE"
              }
            ]
          const chomage = service.getAllocations(experiences, debit)

          expect(chomage.hasAccess).to.be.false
        })
      })

      describe('quand le travailleur a déjà touché le chomage', () => {
        it('il a pas le droit au chomdu', () => {
           debit = [
              {
                "date": 2016,
                "debut": "2016-02-01",
                "fin": "2016-02-31",
                "type": "ARE"
              }
            ]
          const chomage = service.getAllocations(experiences, debit)

          expect(chomage.hasAccess).to.be.false
        })
      })
    })
  })
})
