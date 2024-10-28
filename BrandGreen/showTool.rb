
require 'sketchup.rb'
require_relative  'utils'
module ShowTool
    def self.showTool
      dialog = UI::HtmlDialog.new(
        dialog_title: "Herramientas",
        preferences_key: "ShowTool",
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
      dialog.set_file("#{current_directory}/toolView/index.html")
      # Agrega un listener para cuando la página esté completamente cargada
      dialog.add_action_callback("pageLoaded") {
        puts "Page loaded"
      }
      dialog.add_action_callback("applyTag") {|action_context, tag,index,material|
       self.applyTag(tag, index,material,dialog)
      }
      dialog.add_action_callback("findTag") {|action_context, tag|
        self.select_components_by_tag(tag)
      }
      dialog.add_action_callback("assignRecycled") {|action_context|
        self.assignRecycled(dialog)
       }
      dialog
    end

    def self.applyTag(tag, index,material,dialog)
      # Obtener el modelo activo
      model = Sketchup.active_model
      materials =Sketchup.active_model.materials;
      # Obtener la selección activa
      selection = model.selection
      # Nombre de la nueva capa (tag)
      # Verificar si la capa ya existe, si no, crearla
      #puts material
      new_layer = model.layers[tag.to_s]
      if new_layer.nil?
        new_layer = model.layers.add(tag)
      end
      # Aplicar el cambio a todas las caras seleccionadas
      components = selection.grep(Sketchup::ComponentInstance)
      components.concat(selection.grep(Sketchup::Group))
      if components.empty?
        dialog.execute_script("showModal('There are no Components selected.');")
      else
        components.each do |component|
          component.layer = new_layer
          matToApply = {}
          materials.each do |mat|
            if mat.display_name == material.to_s
              matToApply = mat;
            end
          end
          if matToApply != {}
            component.material = matToApply;
          else
            dialog.execute_script("showModal('The material does not exist in the library.');")
          end
        end
        puts "Las caras seleccionadas han sido movidas a la capa (tag): #{new_layer.name}"
      end
    end
    def self.assignRecycled(dialog)
      # Obtener el modelo activo
      model = Sketchup.active_model;
      tag = "RecycledObject";
      #materials =Sketchup.active_model.materials;
      # Obtener la selección activa
      selection = model.selection
      recycledLayer = model.layers[tag]
      if recycledLayer.nil?
        recycledLayer = model.layers.add(tag)
      end
      # Aplicar el cambio a todas las caras seleccionadas
      components = selection.grep(Sketchup::ComponentInstance)
      components.concat(selection.grep(Sketchup::Group))
      if components.empty?
        dialog.execute_script("showModal('There are no Components selected.');")
      else
        puts "Count Components #{components.size}"
        components.each do |component|
          component.layer = recycledLayer
          puts "Component #{component.layer}"
          component.definition.entities.each do |children|
              layerZero = model.layers["layer0"]
              children.layer = layerZero
          end
        end
        puts "Las caras seleccionadas han sido movidas a la capa (tag): Recycled"
      end
    end
    def self.select_components_by_tag(tag_name)
      model = Sketchup.active_model
      entities = model.entities
      selection = model.selection
      layer = model.layers[tag_name.to_s]
      # Limpia la selección actual
      selection.clear

      # Recorre todas las entidades en el modelo
      entities.each do |entity|
        if entity.is_a?(Sketchup::ComponentInstance) || entity.is_a?(Sketchup::Group)
          if entity.layer == layer
            selection.add(entity)
          end
        end
      end

      # Mensaje de confirmación
      UI.messagebox("Componentes y grupos con la etiqueta '#{tag_name}' han sido seleccionados.")
    end
end
