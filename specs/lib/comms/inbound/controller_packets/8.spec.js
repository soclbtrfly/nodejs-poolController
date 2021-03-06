describe('processes 8 (Heat mode/set point) packets', function() {
  var data = [
    Buffer.from([255,0,255,165,33,15,16,8,13,60,60,55,89,91,7,0,0,51,0,0,0,0,2,151])
  ]

  var equip = 'controller'

  describe('#When packets arrive', function() {
    context('via serialport or Socat', function() {

      before(function() {
        return global.initAllAsync()
      });

      beforeEach(function() {
          loggers = setupLoggerStubOrSpy('stub', 'spy')
        clock = sandbox.useFakeTimers()
        queuePacketStub = sandbox.stub(bottle.container.queuePacket, 'queuePacket')
        //circuitNameStub = sandbox.stub(bottle.container.circuit, 'getCircuitName').returns("POOL")

        bottle.container.heat.init()
      })

      afterEach(function() {
        sandbox.restore()

      })

      after(function() {
        return global.stopAllAsync()
      })

      it('#Pool set point should be Solar Only @ 89 degrees', function() {


          bottle.container.packetBuffer.push(data[0])
        clock.tick(1000)
        var json = bottle.container.temperatures.getTemperatures().temperature
        //console.log('json for heat: ', JSON.stringify(json,null,2))
        json.poolHeatModeStr.should.equal('Solar Only')
        json.poolSetPoint.should.equal(89)
      })


    })
  })
})
