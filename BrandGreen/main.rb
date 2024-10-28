require 'sketchup.rb'
require_relative  'utils'
require_relative  'showMaterials'
require_relative  'showTool'
require_relative  'showStatistics'
require_relative  'exportConfig'
require_relative  'showHowtoUse'

module EcoSysPlugin
  unless file_loaded?(__FILE__)
    menu = UI.menu('Plugins')
    toolView = ShowTool.showTool
    materialView = ShowMaterial.showMaterial
    helpView = ShowHelp.showHelp

    if Configs.file_exists == false
      if helpView.visible?
        helpView.bring_to_front
      else
        helpView = ShowHelp.showHelp
        helpView.show
      end
      Configs.setConf [{}]
    end

    subMenu = menu.add_submenu('Plugin BrandGreen')
    subMenu.add_item("Mostrar estadísticas"){
      ShowStatistics.showStatistics
    }
    config = subMenu.add_submenu('Configuraciones')
    config.add_item("Config. Materiales"){
      if materialView.visible?
        materialView.bring_to_front
      else
        materialView = ShowMaterial.showMaterial
        materialView.show
      end
    }
    config.add_item("Export. Config"){
      ExportConfig.Export
    }
    config.add_item("Import. Config"){
      ExportConfig.Import
    }
    subMenu.add_item("Herramientas"){
      if toolView.visible?
        toolView.bring_to_front
      else
        toolView = ShowTool.showTool
        toolView.show
      end
    }
    subMenu.add_item("Ayuda"){
      if helpView.visible?
        helpView.bring_to_front
      else
        helpView = ShowHelp.showHelp
        helpView.show
      end
    }
    file_loaded(__FILE__)
  end
end
