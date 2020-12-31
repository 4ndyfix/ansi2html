class Ansi2Html
  pallete = {
    :linux => %w(
      000 A00 0A0 A50 00A A0A 0AA AAA
      555 F55 5F5 FF5 55F F5F 5FF FFF
    ),
    :solarized => %w(
      073642 D30102 859900 B58900 268BD2 D33682 2AA198 EEE8D5
      002B36 CB4B16 586E75 657B83 839496 6C71C4 93A1A1 FDF6E3
    ),
    :tango => %w(
      262626 AF0000 5F8700 AF8700 0087FF AF005F 00AFAF E4E4E4
      1C1C1C D75F00 585858 626262 808080 5F5FAF 8A8A8A FFFFD7
    ),
    :xterm => %w(
      000000 CD0000 00CD00 CDCD00 0000EE CD00CD 00CDCD E5E5E5
      7F7F7F FF0000 00FF00 FFFF00 5C5CFF FF00FF 00FFFF FFFFFF
    ),
  }

  STYLES  = {} of String => String
  PALLETE = {} of Symbol => Hash(String, String)

  pallete.each do |key, colors|
    PALLETE[key] = {} of String => String
    (0..15).each do |n|
      PALLETE[key]["ef#{n}"] = "color:##{colors[n]}"
      PALLETE[key]["eb#{n}"] = "background-color:##{colors[n]}"
    end
  end

  (0..5).each do |red|
    (0..5).each do |green|
      (0..5).each do |blue|
        c = 16 + (red * 36) + (green * 6) + blue
        r = red > 0 ? red * 40 + 55 : 0
        g = green > 0 ? green * 40 + 55 : 0
        b = blue > 0 ? blue * 40 + 55 : 0
        STYLES["ef#{c}"] = "color:#%02.2x%02.2x%02.2x" % [r, g, b]
        STYLES["eb#{c}"] = "background-color:#%02.2x%02.2x%02.2x" % [r, g, b]
      end
    end
  end

  (0..23).each do |gray|
    c = gray + 232
    l = gray*10 + 8
    STYLES["ef#{c}"] = "color:#%02.2x%02.2x%02.2x" % [l, l, 1]
    STYLES["eb#{c}"] = "background-color:#%02.2x%02.2x%02.2x" % [l, 1, 1]
  end

  ANSI_ESC_SEQ_REGEX    = /\A\x1b\[((?:\d{1,3};?)+|)m/
  CHARS_TO_REMOVE_REGEX = /\A\x08+/
  MALFORMED_SEQ_REGEX   = /\A\x1b\[?[\d;]{0,3}/
  REAL_TEXT_REGEX       = /\A([^\x1b\x08]+)/m

  def initialize
    @stack = [] of String
    @input = [] of String
  end

  def convert(input : String | Array(String), pallete = :linux)
    case input
    when String        then @input << input
    when Array(String) then @input.concat input
    end
    if PALLETE.keys.includes?(pallete)
      @pallete = pallete
    else
      raise "Sorry, pallete '#{pallete}' is unknown!"
    end
    buf = [] of String
    each { |chunk| buf << chunk }
    buf.join
  end

  def each(&block : String ->)
    @input.each do |chunk|
      buf = String.build { |io| io << chunk }
      tokenize(buf) do |tok, data|
        case tok
        when :text
          block.call data.as(String)
        when :display
          case code = data.as(UInt8)
          when 0, 39, 49 then block.call reset_styles if @stack.any? # NOTE: 39/49 is reset for fg/bg color only
          when 1 then block.call push_tag("b")                       # bright
          when 2                                                     # dim
          when 3, 4 then block.call push_tag("u")
          when 5, 6 then block.call push_tag("blink")
          when 7 # reverse
          when 8        then block.call push_style("display:none")
          when 9        then block.call push_tag("strike")
          when 30..37   then block.call push_style("ef#{code - 30}")
          when 40..47   then block.call push_style("eb#{code - 40}")
          when 90..97   then block.call push_style("ef#{8 + code - 90}")
          when 100..107 then block.call push_style("eb#{8 + code - 100}")
          end
        when :color256f
          code = data
          block.call push_style("ef#{code}")
        when :color256b
          code = data
          block.call push_style("eb#{code}")
        when :colorRGBf
          tuple = data.as(Tuple(UInt8, UInt8, UInt8))
          code = "color:#%02.2x%02.2x%02.2x" % tuple
          block.call push_style("#{code}")
        when :colorRGBb
          tuple = data.as(Tuple(UInt8, UInt8, UInt8))
          code = "background-color:#%02.2x%02.2x%02.2x" % tuple
          block.call push_style("#{code}")
        end
      end
    end
    @input.clear
    block.call reset_styles if @stack.any?
    self
  end

  def push_tag(tag, style = nil)
    style = STYLES[style]? || PALLETE[@pallete || :linux][style] if style && !style.includes?(':')
    @stack.push tag
    ["<#{tag}",
     (" style='#{style}'" if style),
     ">",
    ].join
  end

  def push_style(style)
    push_tag "span", style
  end

  def reset_styles
    stack, @stack = @stack, [] of String
    stack.reverse.map { |tag| "</#{tag}>" }.join
  end

  def tokenize(text, &block : Symbol, String | UInt8 | Tuple(UInt8, UInt8, UInt8) ->)
    tokens = [
      # characters to remove completely
      {CHARS_TO_REMOVE_REGEX, Proc(Regex::MatchData, Void).new { |md| }},
      # ansi escape sequences that mess with the display
      {
        ANSI_ESC_SEQ_REGEX, Proc(Regex::MatchData, Void).new do |md|
          m = md[1].to_s
          m = "0" if m.strip.empty?
          iter = m.chomp(';').split(';').each
          loop do
            code = iter.next
            break if code.is_a? Iterator::Stop
            case code
            when "38" # foreground
              color_type = iter.next
              case color_type
              when "5" # 8 bit colors (256)
                color256 = UInt8.new(iter.next.as String)
                block.call :color256f, color256
              when "2" # 24 bit true-colors (RGB)
                r, g, b = UInt8.new(iter.next.as String), UInt8.new(iter.next.as String), UInt8.new(iter.next.as String)
                block.call :colorRGBf, Tuple.new(r, g, b)
              end
            when "48" # background
              color_type = iter.next
              case color_type
              when "5" # 8 bit colors (256)
                color256 = UInt8.new(iter.next.as String)
                block.call :color256b, color256
              when "2" # 24 bit true-colors (RGB)
                r, g, b = UInt8.new(iter.next.as String), UInt8.new(iter.next.as String), UInt8.new(iter.next.as String)
                block.call :colorRGBb, Tuple.new(r, g, b)
              end
            else
              block.call :display, UInt8.new code
            end
          end
        end,
      },
      # malformed sequences
      {MALFORMED_SEQ_REGEX, Proc(Regex::MatchData, Void).new { |md| }},
      # real text
      {REAL_TEXT_REGEX, Proc(Regex::MatchData, Void).new { |md| block.call :text, md[1] }},
    ]
    while (size = text.size) > 0
      tokens.each do |token|
        pattern, sub = token[0], token[1]
        md = text.match pattern
        if md
          text = text.sub(pattern) { sub.call(md) }
          break
        end
      end
      break if text.size == size
    end
  end
end
