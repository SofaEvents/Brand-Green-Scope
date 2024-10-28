require 'sketchup.rb'

module ShowHelp
  def self.showHelp
    dialog = UI::HtmlDialog.new(
      dialog_title: "Ayuda",
      preferences_key: "Ayuda",
      scrollable: true,
      resizable: true,
      width: 300,
      height: 400,
      left: 100,
      top: 100,
      min_width: 300,
      min_height: 400,
      max_width: 1000,
      max_height: 1000,
      style: UI::HtmlDialog::STYLE_WINDOW
    )
    current_directory = File.dirname(File.expand_path(__FILE__))
    dialog.set_file("#{current_directory}/howToUse/index.html")
    # Agrega un listener para cuando la página esté completamente cargada
    dialog
  end
end
