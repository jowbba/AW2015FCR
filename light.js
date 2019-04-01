// AW2015FCR I2C-BUS
const i2c = require('i2c-bus')
let i2c1 = i2c.openSync(3)

function manual(r, g, b) {
  setLedMode(0x00) // 手动模式
  setLed([r], [g], [b]) // 颜色设置
}

function singlePulseMode(r, g, b) {
  set(0x02, 0b00010010) // pattern controller 

  setLedMode(0x01, 0x01) // 内置模式
  setLed([r, 0x00], [g, 0xff], [b, 0x00]) // 颜色设置
  

  setTRiseAndOn(0x33, 0b00001010) 
  setTFallAndOff(0x33, 0b00000000)
  setTSlotAndDelay(0x33, 0b00000000)

  setTime(0b11000000, 0b00000010)
  set(0x34, 0x02)

  run(0b00000001)
}

function multiPulseMode(r, g, b) {
  setLedMode(0x07) // 内置模式
  setLed([r], [g], [b]) // 颜色设置

  setTRiseAndOn(0x11)
  setTFallAndOff(0x13)
  setTSlotAndDelay(0x00)

  setTime(0x10) // 控制次数
}

function multiColorMode() {
  setLedMode(0x07) // 内置模式
  setLed([0xff], [null, 0xff], [null, null, 0xff]) // 颜色设置

  setTRiseAndOn(0x33)
  setTFallAndOff(0x33)
  setTSlotAndDelay(0x33)
  setTime(0x07) // 控制颜色数量
}

function multiColorAndPulseMode() {
  setLedMode(0x07) // 内置模式
  setLed([0xff], [null, 0xff], [null, null, 0xff]) // 颜色设置

  setTRiseAndOn(0x11)
  setTFallAndOff(0x13)
  setTSlotAndDelay(0x00)

  setTime(0x17) // 控制颜色数量及脉冲数量
}

// 
function multiPattern() {
  // single multi 5  -> 
  setLedMode(0x07) // 内置模式
  setLed([0xff], [null, 0xff]) // 颜色设置
  
}

// mode
function setLedMode (value) {
  // 0x07 pattern mode
  // 0x06 manual mode
  set(0x04, value)
  set(0x05, value)
  set(0x06, value)
}

function setLed([r1, r2, r3, r4], [g1, g2, g3, g4], [b1, b2, b3, b4]) {
  set(0x10, r1 || 0x00)
  set(0x13, r2 || 0x00)
  set(0x16, r3 || 0x00)
  set(0x19, r4 || 0x00)  
  set(0x11, g1 || 0x00)
  set(0x14, g2 || 0x00)
  set(0x17, g3 || 0x00)
  set(0x1A, g4 || 0x00)  
  set(0x12, b1 || 0x00)
  set(0x15, b2 || 0x00)
  set(0x18, b3 || 0x00)
  set(0x1B, b4 || 0x00)  
}

// PWMs
function setPWMS (l1, l2, l3) {
  set(0x1C, l1)
  set(0x1D, l2)
  set(0x1E, l3)
}

function setTRiseAndOn(v1, v2, v3) {
  set(0x30, v1 || 0x00)
  set(0x35, v2 || 0x00)
  set(0x3A, v3 || 0x00)
}

function setTFallAndOff(v1, v2, v3) {
  set(0x31, v1 || 0x00)
  set(0x36, v2 || 0x00)
  set(0x3B, v3 || 0x00)
}

function setTSlotAndDelay(v1, v2, v3) {
  set(0x32, v1 || 0x00)
  set(0x37, v2 || 0x00)
  set(0x3C, v3 || 0x00)
}

function setTime(v1, v2, v3) {
  set(0x33, v1 || 0x00)
  set(0x38, v2 || 0x00)
  set(0x3D, v3 || 0x00)
}

function get(cmd, num) {
  let result =  i2c1.readByteSync(0x64, cmd)
  return `${!num?'0x':''}${result.toString(num || 16)}`
}

function set(cmd, byte) {
  let result = i2c1.writeByteSync(0x64, cmd, byte)
  // console.log(get(cmd, 2))
}

function stop() {
  set(0x09, 0x70)
}

function run(value) {
  set(0x09, value || 0x07)
}

set(0x00, 0x55) // reboot
set(0x01, 0x01) // enter active
// set(0x02, 0x01) // pattern controller 
set(0x03, 0x00) // max brightness
set(0x07, 0x07) // enable all 
set(0x08, 0x08) // require in multi color mode
setPWMS(0x88, 0x88, 0x88)
// manual(0x76, 0xbe, 0xcc)
singlePulseMode(0x76, 0xbe, 0xcc)
// multiPulseMode(0x76, 0xbe, 0xcc)
// multiColorMode()
// multiColorAndPulseMode()
// multiPattern()

// run(0x01)
i2c1.closeSync()


