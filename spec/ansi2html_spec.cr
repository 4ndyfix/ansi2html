require "./spec_helper"

describe Ansi2Html do
  converter = Ansi2Html.new

  it "does not modify input string" do
    text = "some text"
    result = converter.convert text
    result.should eq text
  end

  it "passes through text with no escapes" do
    text = "hello\nthis is ansi2html\n"
    result = converter.convert text
    result.should eq text
  end

  it "removes backspace characters" do
    text = "Like\b this or \b\bthat"
    expected = "Like this or that"
    result = converter.convert text
    result.should eq expected
  end

  it "creates simple foreground colors" do
    text = "colors: #{"black".colorize(:black)}#{"white".colorize(:white)}"
    expected = "colors: " +
               "<span style='color:#000'>black</span>" +
               "<span style='color:#FFF'>white</span>"
    result = converter.convert text
    result.should eq expected
  end

  it "creates underlined text" do
    text = "underline: #{"stuff".colorize.underline}"
    expected = "underline: <u>stuff</u>"
    result = converter.convert text
    result.should eq expected
  end

  it "creates bolded text" do
    text = "bold: #{"stuff".colorize.bold}"
    expected = "bold: <b>stuff</b>"
    result = converter.convert text
    result.should eq expected
  end

  it "creates striked-through text" do # not supported by Colorize
    text = "strike: \x1b[9mthat"
    expected = "strike: <strike>that</strike>"
    result = converter.convert text
    result.should eq expected
  end

  it "creates blinked text" do
    text = "blink: #{"what".colorize.blink}"
    expected = "blink: <blink>what</blink>"
    result = converter.convert text
    result.should eq expected
  end

  it "resets a single sequence" do # not supported by Colorize
    text = "\x1b[1mthis is bold\x1b[0m, but this isn't"
    expected = "<b>this is bold</b>, but this isn't"
    result = converter.convert text
    result.should eq expected
  end

  it "resets many sequences" do # not supported by Colorize
    text = "normal, \x1b[1mbold, \x1b[3munderline, \x1b[31mred\x1b[0m, normal"
    expected = "normal, <b>bold, <u>underline, " +
               "<span style='color:#A00'>red</span></u></b>, normal"
    result = converter.convert text
    result.should eq expected
  end

  it "resets without an implicit 0 argument" do # not supported by Colorize
    text = "\x1b[1mthis is bold\x1b[m, but this isn't"
    expected = "<b>this is bold</b>, but this isn't"
    result = converter.convert text
    result.should eq expected
  end

  it "handles multi-attribute sequences" do # not supported by Colorize
    text = "normal, \x1b[1;3;31mbold, underline, and red\x1b[0m, normal"
    expected = "normal, <b><u><span style='color:#A00'>" +
               "bold, underline, and red</span></u></b>, normal"
    result = converter.convert text
    result.should eq expected
  end

  it "handles multi-attribute sequences by Colorize" do
    text = "normal, #{"bold, underline, and red".colorize.bold.underline.fore(:red)}, normal"
    expected = "normal, <span style='color:#A00'><b><u>" +
               "bold, underline, and red</u></b></span>, normal"
    result = converter.convert text
    result.should eq expected
  end

  it "handles multi-attribute sequences with a trailing semi-colon" do # not supported by Colorize
    text = "normal, \x1b[1;3;31;mbold, underline, and red\x1b[0m, normal"
    expected = "normal, <b><u><span style='color:#A00'>" +
               "bold, underline, and red</span></u></b>, normal"
    result = converter.convert text
    result.should eq expected
  end

  it "eats malformed sequences" do
    text = "\x1b[25oops forgot the 'm'"
    expected = "oops forgot the 'm'"
    result = converter.convert text
    result.should eq expected
  end

  it "creates 8-bit (256) color foregrounds and backgrounds" do
    gold_on_darkred = "gold-on-darkred"
      .colorize(Colorize::Color256.new(220))
      .back(Colorize::Color256.new(88)).to_s
    darkblue_on_lightsalmon = "darkblue-on-lightsalmon"
      .colorize(Colorize::Color256.new(18))
      .back(Colorize::Color256.new(216)).to_s
    expected = "<span style='color:#ffd700'><span style='background-color:#870000'>gold-on-darkred</span></span>" +
               "<span style='color:#000087'><span style='background-color:#ffaf87'>darkblue-on-lightsalmon</span></span>"
    result = converter.convert [gold_on_darkred, darkblue_on_lightsalmon]
    result.should eq expected
  end

  it "creates 24-bit true-color foregrounds and backgrounds" do
    gold_on_darkred = "gold-on-darkred"
      .colorize(Colorize::ColorRGB.new(255, 215, 0))
      .back(Colorize::ColorRGB.new(135, 0, 0)).to_s
    darkblue_on_lightsalmon = "darkblue-on-lightsalmon"
      .colorize(Colorize::ColorRGB.new(0, 0, 135))
      .back(Colorize::ColorRGB.new(255, 175, 135)).to_s
    expected = "<span style='color:#ffd700'><span style='background-color:#870000'>gold-on-darkred</span></span>" +
               "<span style='color:#000087'><span style='background-color:#ffaf87'>darkblue-on-lightsalmon</span></span>"
    result = converter.convert [gold_on_darkred, darkblue_on_lightsalmon]
    result.should eq expected
  end
end
