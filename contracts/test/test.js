'use strict'
const Ticket = artifacts.require("./TEMTicket.sol")

contract('test', function(accounts) {
  const admin = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]
  const user3 = accounts[3]
  const user4 = accounts[4]
  const TEMWallet = accounts[5]
  const FEE = Number(web3.toWei(0.03, "ether"))

  const donation1 = 500000;
  const donation2 = 5000000;

  const balanceOf = async function (address) {
    return await web3.eth.getBalance(address)
  }

  it("go through all steps", async function() {
    var userAmount;
    var ticket = await Ticket.new(TEMWallet, 3, {from: admin})
    var ticket_balance = await balanceOf(ticket.address)

    userAmount = await ticket.userAmount();
    assert.equal(userAmount, 0);

    // user1 get the ticket throught fallback function
    await web3.eth.sendTransaction({ from: user1, to: ticket.address, value: FEE })

    // user2 get the ticket, more than FEE would be see as donate
    await ticket.getTicket(user2, { from: user2, value: FEE + donation1})

    // user3 get the ticket
    await web3.eth.sendTransaction({ from: user3, to: ticket.address, value: FEE + donation2})
    userAmount = await ticket.userAmount();
    assert.equal(userAmount, 3);


    // check ticket contract balance
    var ticket_balance2 = await balanceOf(ticket.address)
    assert.equal(ticket_balance2 - ticket_balance, 3 * FEE + donation1 + donation2)

     // same address should not buy ticket again
    try {
      await ticket.getTicket(user2, {from: user2, value: FEE })
      assert.fail('Expected revert not received')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0 || error.message.search('assert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }

    // reach max attendees
    try {
      await ticket.getTicket(user4, { from: user4, value: FEE })
      assert.fail('Expected revert not received')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0 || error.message.search('assert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }

    userAmount = await ticket.userAmount();
    assert.equal(userAmount, 3);
  });
});
