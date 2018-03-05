'use strict'
const Ticket = artifacts.require("./TEMTicket.sol")

contract('test', function(accounts) {
  const admin = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]
  const user3 = accounts[3]
  const TEMWallet = accounts[4]
  const DEPOSIT = Number(web3.toWei(0.001, "ether"))

  const balanceOf = async function (address) {
    return await web3.eth.getBalance(address)
  }

  it("go through all steps", async function() {
    var ticket = await Ticket.new(TEMWallet, {from: admin})
    var ticket_balance = await balanceOf(ticket.address)

    // user1 get the ticket throught fallback function 
    await web3.eth.sendTransaction({from: user1, to: ticket.address, value: DEPOSIT})

    // user2 get the ticket, more than DEPOSIT would be see as donate
    await ticket.getTicket(user2, {from: user2, value: DEPOSIT + 500000})

    // user3 get the ticket
    await web3.eth.sendTransaction({from: user3, to: ticket.address, value: DEPOSIT + 5000000})

    // check ticket contract balance
    var ticket_balance2 = await balanceOf(ticket.address)
    assert.equal(ticket_balance2 - ticket_balance, 3 * DEPOSIT)

     // same address should not buy ticket again
    try {
      await ticket.getTicket(user2, {from: user2, value: DEPOSIT })
      assert.fail('Expected revert not received')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0 || error.message.search('assert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }

    // set the attended information 
    await ticket.setAttendBatch(0x1100, {from: admin}) // user1: 0 user2: 1 user3: 1

    // user1 is not attended, should not get back the fund 
    try {
      await ticket.getRefund({from: user1})
      assert.fail('Expected revert not received')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0 || error.message.search('assert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }
    
    // user2 getRefund throught fallback function 
    await web3.eth.sendTransaction({from: user2, to: ticket.address})

    // user3 getRefund
    await ticket.getRefund({from: user3})

    // check ticket contract balance, should only remain user1's deposit 
    var ticket_balance3 = await balanceOf(ticket.address)
    console.log(ticket_balance3)
    assert.equal(ticket_balance3, DEPOSIT)
  });
});
