
require 'sketchup.rb'
require_relative  'utils'
module ShowMaterial
    def self.showMaterial
      dialog = UI::HtmlDialog.new(
        dialog_title: "Materiales",
        preferences_key: "show_Materials",
        scrollable: true,
        resizable: true,
        width: 700,
        height: 400,
        left: 100,
        top: 100,
        min_width: 700,
        min_height: 400,
        max_width: 1000,
        max_height: 1000,
        style: UI::HtmlDialog::STYLE_WINDOW
      )
      current_directory = File.dirname(File.expand_path(__FILE__))
      dialog.set_file("#{current_directory}/configMaterials/index.html")
      mats = Sketchup.active_model.materials
      dialog.add_action_callback("xd") { |action_context, param|
        puts "Page loaded #{param}"
      }
         # Agrega un listener para cuando la página esté completamente cargada
      dialog.add_action_callback("pageLoaded") {
        matsImports = self.obtener_materiales_importados
        # Pasar el JSON al diálogo de JavaScript
        dialog.execute_script("setMats(#{matsImports})")
      }
      dialog.add_action_callback("matUpdate") {|action_context, element,index|
       self.updateMats(element, index)
      }
      dialog.add_action_callback("matRemoved") {|action_context,index|
        self.RemoveMats(index)
      }
      dialog.add_action_callback("matAdded") {|action_context,element|
        self.addMat(element)
      }
      dialog
    end

    def self.updateMats(element, id)
      conf = Configs.getConf
      index = Math.buscar_indice_por_id(conf,id)
      puts "index: #{index} --- id #{id}"
      conf[index.to_i] = element
      Configs.setConf conf
    end
    def self.RemoveMats(id)
      conf = Configs.getConf
      index = Math.buscar_indice_por_id(conf,id)
      puts "id: #{id} -- index #{index}"
      conf.slice!(index.to_i)
      Configs.setConf conf
    end
    def self.addMat(element)
      conf = Configs.getConf
      conf.push(element)
      Configs.setConf conf
    end
    # Obtener todos los materiales del modelo
    def self.obtener_materiales_importados
      # Obtener la referencia al modelo activo
      model = Sketchup.active_model

      # Obtener todos los materiales del modelo
      materials = model.materials

      # Crear un array para almacenar los nombres de los materiales importados
      materiales_importados = []

      # Iterar sobre todos los materiales y verificar si son importados
      materials.each do |material|
          # Agregar el nombre del material importado al array
          materiales_importados << material.display_name
      end

      # Devolver el array de nombres de materiales importados
       return materiales_importados
    end
end
