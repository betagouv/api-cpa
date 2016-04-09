'use strict';


const moment = require('moment')

module.exports = AllocationChomage

function AllocationChomage() {
}

AllocationChomage.prototype.getAllocations = function(experiences, debits) {
  let hasAccess = this.hasAccess(experiences, debits)
  return {
    hasAccess
  }
}

AllocationChomage.prototype.hasAccess = function(experiences, debits) {
  if(this.hasNotWorked(experiences)) {
    return false
  }
  if(this.isWorking(experiences)) {
    return false
  }
  if(this.hasChomage(debits)) {
    return false
  }
  if(this.hadChomageWithoutWorkingAfter(experiences, debits)) {
    return false
  }
  return true
}

AllocationChomage.prototype.hasChomage = function(debits){
  if (debits.length === 0) return false;
  const now = moment()
  const dateFinChomage =  moment(debits[0].fin);
  return  now.isBefore(dateFinChomage)
}

AllocationChomage.prototype.hadChomageWithoutWorkingAfter = function(experiences, debits){
  if (debits.length === 0) return false;
  const dateDebutChomage = moment(debits[0].debut);
  const dateFinTravail = moment(experiences[0].emploi.fin);
  return dateDebutChomage.isAfter(dateFinTravail)
}

AllocationChomage.prototype.hasNotWorked = function(experiences) {
   return experiences.length === 0
}

AllocationChomage.prototype.isWorking = function(experiences) {
   return !experiences[0].emploi.fin
}
