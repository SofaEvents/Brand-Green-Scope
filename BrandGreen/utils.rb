require 'json'



  module Configs
    def self.setConf(data)
     # Convertir el objeto a JSON
      json_data = JSON.generate(data)
     # Escribir el archivo JSON
     current_directory = File.dirname(File.expand_path(__FILE__))
     file_path = "#{current_directory}/archivo.json"
     File.write(file_path, json_data)
    end
    def self.getConf
      current_directory = File.dirname(File.expand_path(__FILE__))
      file_path = "#{current_directory}/archivo.json"
      file = File.read(file_path)
      # Convertir el objeto a JSON
      json_data = JSON.parse(file)
      json_data
     end
     def self.file_exists
      current_directory = File.dirname(File.expand_path(__FILE__))
      file_path = "#{current_directory}/archivo.json"
      File.exist?(file_path)
    end
  end

  module Math
    def self.square_meter_to_volume(area, tickness, value)
      volume = area * (tickness / 1000.0)
      e_vol = value / volume
      return e_vol.round(8)
    end
    def self.buscar_indice_por_id(list, id)
      # Iterar sobre el arreglo de materiales
      list.each_with_index do |element, index|
        if element["id"].to_i == id.to_i
          return index  # Devolver el índice cuando se encuentre el material
        end
      end

      return nil  # Devolver nil si no se encuentra el material con el id buscado
    end
  end
