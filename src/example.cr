require "colorize"
require "ansi2html"

color = 90
ansi_text = String.build do |io|
  io << Time.utc.to_s("%A %Y-%m-%d %H:%M:%S %:z")
    .split.map { |text| "\x1b[#{(color += 1).to_s}m#{text}\x1b[0m" }.join(" ")
  io << "\n#{"-" * 36}\n\nImportant #{"MARVEL".colorize(:white).back(:red).bold} heroes:\n"
  io << " IRON MAN ".colorize(Colorize::Color256.new(221)).back(Colorize::Color256.new(88)).bright
  io << " " << " H U L K ".colorize(:black).back(Colorize::Color256.new(22)).bold.underline << " "
  io << "CaptainAmerica".colorize(:white).back(Colorize::ColorRGB.new(0, 0, 95)).bold
  io << "\n\nThere was an idea to bring together...\n"
  io << " ansi2html ".colorize(:black).back(Colorize::Color256.new(153))
end

puts ansi_text

html_frag = Ansi2Html.new.convert ansi_text

puts html_frag

File.open "ansi2.html", "w" do |f|
  f.puts <<-HTML
    <html>
      <head/>
        <body style="background-color:black;color:lightblue;">
          <pre style="font-size:30px">#{html_frag}</pre>
        </body>
    </html>
  HTML
end
