# Importa la clase UI
require 'sketchup.rb'
require 'fileutils'

module ExportConfig
  def self.Export
    # Crea un cuadro de diálogo de guardado
    save_panel = UI.savepanel("Save Config File", "", "Config Files|*.conf;*.json;||")


    # Verifica si el usuario hizo clic en "Guardar"
    if save_panel
      # Aquí puedes guardar los datos o realizar otras acciones con el archivo
      puts "Archivo guardado en: #{save_panel}"
      current_directory = File.dirname(File.expand_path(__FILE__))
      file_path = "#{current_directory}/archivo.json"
      # Copia el archivo
      FileUtils.cp(file_path, save_panel)
    else
      puts "El usuario canceló el guardado."
    end
  end
  def self.Import
    # Crea un cuadro de diálogo de guardado
    open_panel = UI.openpanel("Open Config File", "", "Config Files|*.conf;*.json;||")


    # Verifica si el usuario hizo clic en "Guardar"
    if open_panel
      # Aquí puedes guardar los datos o realizar otras acciones con el archivo
      puts "Archivo guardado en: #{open_panel}"
      current_directory = File.dirname(File.expand_path(__FILE__))
      file_path = "#{current_directory}/archivo.json"
      # Copia el archivo
      FileUtils.cp(open_panel,file_path)
    else
      puts "El usuario canceló el guardado."
    end
  end
end
