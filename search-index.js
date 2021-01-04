crystal_doc_search_index_callback({"repository_name":"ansi2html","body":"\n![](ansi2html.png)\n\n\n# ansi2html\nConverts colored terminal output to html tags.\n\nANSI color escape sequences, created for example by the Colorize module,\nare converted to valid HTML fragments for using in a HTML document.\n\nOne use case could be to build a web service for a CLI tool.\nThen show the original colored output in an integrated web UI.\n\nThe basic work was done by the Ruby community. Many thanks to\n[bcat](https://github.com/rtomayko/bcat/blob/master/lib/bcat/ansi.rb) and\n[ansi-to-html](https://github.com/uu59/ansi-to-html).\n\nBy using the Colorize module for input: ColorANSI, Color256, ColorRGB and available text decorations can be mixed-used. True-color (24-bit RGB) support was added.\n\n[![GitHub release](https://img.shields.io/github/release/4ndyfix/ansi2html.svg)](https://github.com/4ndyfix/ansi2html/releases)\n\n## Installation\n\n1. Add the dependency to your “shard.yml’:\n\n```yaml\ndependencies:\n  ansi2html:\n    github: 4ndyfix/ansi2html\n```\n\n2. Run `shards install`\n\n## Usage\n\nA very simple example.\n\n```crystal\nrequire \"colorize\"\nrequire \"ansi2html\"\n\ncolor = 90\nansi_text = String.build do |io|\n  io << Time.utc.to_s(\"%A %Y-%m-%d %H:%M:%S %:z\")\n    .split.map { |text| \"\\x1b[#{(color += 1).to_s}m#{text}\\x1b[0m\"}.join(\" \")\n  io << \"\\n#{\"-\" * 36}\\n\\nImportant #{\"MARVEL\".colorize(:white).back(:red).bold} heroes:\\n\"\n  io << \" IRON MAN \".colorize(Colorize::Color256.new(221)).back(Colorize::Color256.new(88)).bright\n  io << \" \" << \" H U L K \".colorize(:black).back(Colorize::Color256.new(22)).bold.underline << \" \"\n  io << \"CaptainAmerica\".colorize(:white).back(Colorize::ColorRGB.new(0, 0, 95)).bold\n  io << \"\\n\\nThere was an idea to bring together...\\n\"\n  io << \" ansi2html \".colorize(:black).back(Colorize::Color256.new(153))\nend\n\nputs ansi_text\n\nhtml_frag = Ansi2Html.new.convert ansi_text\n\nputs html_frag\n\nFile.open \"ansi2.html\", \"w\" do |f|\n  f.puts <<-HTML\n    <html>\n      <head/>\n        <body style=\"background-color:black;color:lightblue;\">\n          <pre style=\"font-size:30px\">#{html_frag}</pre>\n        </body>\n    </html>\n  HTML\nend\n```\nPlease open the file `ansi2.html` in a web browser.\n\n![](screenshot.png)\n\n## Contributing\n\n1. Fork it (<https://github.com/4ndyfix/ansi2html/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am \"Add some feature\"`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n* [4ndyfix](https://github.com/4ndyfix) - creator and maintainer\n","program":{"html_id":"ansi2html/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"ansi2html","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"ansi2html/Ansi2Html","path":"Ansi2Html.html","kind":"class","full_name":"Ansi2Html","name":"Ansi2Html","abstract":false,"superclass":{"html_id":"ansi2html/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"ansi2html/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"ansi2html/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/ansi2html.cr","line_number":1,"url":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L1"}],"repository_name":"ansi2html","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"ANSI_ESC_SEQ_REGEX","name":"ANSI_ESC_SEQ_REGEX","value":"/\\A\\x1b\\[((?:\\d{1,3};?)+|)m/","doc":null,"summary":null},{"id":"CHARS_TO_REMOVE_REGEX","name":"CHARS_TO_REMOVE_REGEX","value":"/\\A\\x08+/","doc":null,"summary":null},{"id":"MALFORMED_SEQ_REGEX","name":"MALFORMED_SEQ_REGEX","value":"/\\A\\x1b\\[?[\\d;]{0,3}/","doc":null,"summary":null},{"id":"PALLETE","name":"PALLETE","value":"{} of Symbol => Hash(String, String)","doc":null,"summary":null},{"id":"REAL_TEXT_REGEX","name":"REAL_TEXT_REGEX","value":"/\\A([^\\x1b\\x08]+)/m","doc":null,"summary":null},{"id":"STYLES","name":"STYLES","value":"{} of String => String","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new-class-method","html_id":"new-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L57","def":{"name":"new","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"convert(input:String|Array(String),pallete=:linux)-instance-method","html_id":"convert(input:String|Array(String),pallete=:linux)-instance-method","name":"convert","doc":null,"summary":null,"abstract":false,"args":[{"name":"input","doc":null,"default_value":"","external_name":"input","restriction":"String | Array(String)"},{"name":"pallete","doc":null,"default_value":":linux","external_name":"pallete","restriction":""}],"args_string":"(input : String | Array(String), pallete = <span class=\"n\">:linux</span>)","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L62","def":{"name":"convert","args":[{"name":"input","doc":null,"default_value":"","external_name":"input","restriction":"String | Array(String)"},{"name":"pallete","doc":null,"default_value":":linux","external_name":"pallete","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"case input\nwhen String\n  @input << input\nwhen Array(String)\n  @input.concat(input)\nend\nif PALLETE.keys.includes?(pallete)\n  @pallete = pallete\nelse\n  raise(\"Sorry, pallete '#{pallete}' is unknown!\")\nend\nbuf = [] of String\neach do |chunk|\n  buf << chunk\nend\nbuf.join\n"}},{"id":"each(&block:String->)-instance-method","html_id":"each(&block:String->)-instance-method","name":"each","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"(&block : String -> )","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L77","def":{"name":"each","args":[],"double_splat":null,"splat_index":null,"yields":1,"block_arg":{"name":"block","doc":null,"default_value":"","external_name":"block","restriction":"(String -> )"},"return_type":"","visibility":"Public","body":"@input.each do |chunk|\n  buf = String.build do |io|\n    io << chunk\n  end\n  tokenize(buf) do |tok, data|\n    case tok\n    when :text\n      block.call(data.as(String))\n    when :display\n      case code = data.as(UInt8)\n      when 0, 39, 49\n        if @stack.any?\n          block.call(reset_styles)\n        end\n      when 1\n        block.call(push_tag(\"b\"))\n      when 2\n      when 3, 4\n        block.call(push_tag(\"u\"))\n      when 5, 6\n        block.call(push_tag(\"blink\"))\n      when 7\n      when 8\n        block.call(push_style(\"display:none\"))\n      when 9\n        block.call(push_tag(\"strike\"))\n      when 30..37\n        block.call(push_style(\"ef#{code - 30}\"))\n      when 40..47\n        block.call(push_style(\"eb#{code - 40}\"))\n      when 90..97\n        block.call(push_style(\"ef#{(8 + code) - 90}\"))\n      when 100..107\n        block.call(push_style(\"eb#{(8 + code) - 100}\"))\n      end\n    when :color256f\n      code = data\n      block.call(push_style(\"ef#{code}\"))\n    when :color256b\n      code = data\n      block.call(push_style(\"eb#{code}\"))\n    when :colorRGBf\n      tuple = data.as(Tuple(UInt8, UInt8, UInt8))\n      code = \"color:#%02.2x%02.2x%02.2x\" % tuple\n      block.call(push_style(\"#{code}\"))\n    when :colorRGBb\n      tuple = data.as(Tuple(UInt8, UInt8, UInt8))\n      code = \"background-color:#%02.2x%02.2x%02.2x\" % tuple\n      block.call(push_style(\"#{code}\"))\n    end\n  end\nend\n@input.clear\nif @stack.any?\n  block.call(reset_styles)\nend\nself\n"}},{"id":"push_style(style)-instance-method","html_id":"push_style(style)-instance-method","name":"push_style","doc":null,"summary":null,"abstract":false,"args":[{"name":"style","doc":null,"default_value":"","external_name":"style","restriction":""}],"args_string":"(style)","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L130","def":{"name":"push_style","args":[{"name":"style","doc":null,"default_value":"","external_name":"style","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"push_tag(\"span\", style)"}},{"id":"push_tag(tag,style=nil)-instance-method","html_id":"push_tag(tag,style=nil)-instance-method","name":"push_tag","doc":null,"summary":null,"abstract":false,"args":[{"name":"tag","doc":null,"default_value":"","external_name":"tag","restriction":""},{"name":"style","doc":null,"default_value":"nil","external_name":"style","restriction":""}],"args_string":"(tag, style = <span class=\"n\">nil</span>)","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L121","def":{"name":"push_tag","args":[{"name":"tag","doc":null,"default_value":"","external_name":"tag","restriction":""},{"name":"style","doc":null,"default_value":"nil","external_name":"style","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"if style && (!(style.includes?(':')))\n  style = STYLES[style]? || PALLETE[@pallete || (:linux)][style]\nend\n@stack.push(tag)\n[\"<#{tag}\", (if style\n  \" style='#{style}'\"\nend), \">\"].join\n"}},{"id":"reset_styles-instance-method","html_id":"reset_styles-instance-method","name":"reset_styles","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L134","def":{"name":"reset_styles","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"stack, @stack = @stack, [] of String\nstack.reverse.map do |tag|\n  \"</#{tag}>\"\nend.join\n"}},{"id":"tokenize(text,&block:Symbol,String|UInt8|Tuple(UInt8,UInt8,UInt8)->)-instance-method","html_id":"tokenize(text,&block:Symbol,String|UInt8|Tuple(UInt8,UInt8,UInt8)->)-instance-method","name":"tokenize","doc":null,"summary":null,"abstract":false,"args":[{"name":"text","doc":null,"default_value":"","external_name":"text","restriction":""}],"args_string":"(text, &block : Symbol, String | UInt8 | Tuple(UInt8, UInt8, UInt8) -> )","source_link":"https://github.com/4ndyfix/ansi2html/blob/9bb236232fd8dd8e4814e5193c7cfbd76cdd20e3/src/ansi2html.cr#L139","def":{"name":"tokenize","args":[{"name":"text","doc":null,"default_value":"","external_name":"text","restriction":""}],"double_splat":null,"splat_index":null,"yields":2,"block_arg":{"name":"block","doc":null,"default_value":"","external_name":"block","restriction":"(Symbol, String | UInt8 | Tuple(UInt8, UInt8, UInt8) -> )"},"return_type":"","visibility":"Public","body":"tokens = [{CHARS_TO_REMOVE_REGEX, Proc(Regex::MatchData, Void).new do |md|\nend}, {ANSI_ESC_SEQ_REGEX, Proc(Regex::MatchData, Void).new do |md|\n  m = md[1].to_s\n  if m.strip.empty?\n    m = \"0\"\n  end\n  iter = ((m.chomp(';')).split(';')).each\n  loop do\n    code = iter.next\n    if code.is_a?(Iterator::Stop)\n      break\n    end\n    case code\n    when \"38\"\n      color_type = iter.next\n      case color_type\n      when \"5\"\n        color256 = UInt8.new(iter.next.as(String))\n        block.call(:color256f, color256)\n      when \"2\"\n        r, g, b = UInt8.new(iter.next.as(String)), UInt8.new(iter.next.as(String)), UInt8.new(iter.next.as(String))\n        block.call(:colorRGBf, Tuple.new(r, g, b))\n      end\n    when \"48\"\n      color_type = iter.next\n      case color_type\n      when \"5\"\n        color256 = UInt8.new(iter.next.as(String))\n        block.call(:color256b, color256)\n      when \"2\"\n        r, g, b = UInt8.new(iter.next.as(String)), UInt8.new(iter.next.as(String)), UInt8.new(iter.next.as(String))\n        block.call(:colorRGBb, Tuple.new(r, g, b))\n      end\n    else\n      block.call(:display, UInt8.new(code))\n    end\n  end\nend}, {MALFORMED_SEQ_REGEX, Proc(Regex::MatchData, Void).new do |md|\nend}, {REAL_TEXT_REGEX, Proc(Regex::MatchData, Void).new do |md|\n  block.call(:text, md[1])\nend}]\nwhile (size = text.size) > 0\n  tokens.each do |token|\n    pattern, sub = token[0], token[1]\n    md = text.match(pattern)\n    if md\n      text = text.sub(pattern) do\n        sub.call(md)\n      end\n      break\n    end\n  end\n  if text.size == size\n    break\n  end\nend\n"}}],"macros":[],"types":[]}]}})