
require 'sketchup.rb'
require_relative  'utils'
#Statistics
module ShowStatistics
  def self.cubic_inches_to_cubic_meters(cubic_inches)
    cubic_meters = cubic_inches / 61023.7441
    return cubic_meters
  end

  def self.showStatistics
    dialog = UI::HtmlDialog.new(
      dialog_title: "Estadísticas",
      preferences_key: "show_Statistics",
      scrollable: true,
      resizable: true,
      width: 700,
      height: 450,
      left: 100,
      top: 100,
      min_width: 400,
      min_height: 450,
      max_width: 1000,
      max_height: 1000,
      style: UI::HtmlDialog::STYLE_WINDOW
    )
    current_directory = File.dirname(File.expand_path(__FILE__))
    dialog.set_file("#{current_directory}/statisticsView/index.html")
    dialog.add_action_callback("xd") { |action_context, param|
      data = self.showMats
      dialog.execute_script("loadData('#{data["colorCode"]}','#{data["statisticsMats"]}','#{data["recycledObjects"]}', '#{data["countObjs"]}')")
    }
       # Agrega un listener para cuando la página esté completamente cargada
    dialog.add_action_callback("pageLoaded") {
      # dialog.execute_script("alert('Hello from SketchUp Ruby!');")
    }
    #self.showMats
    dialog.show_modal
    dialog
  end
  def self.showStatistics2

  end

  def self.showMats
    model = Sketchup.active_model
    conf = Configs.getConf
    definitions = model.definitions
    dic_mats = {}
    dic_colorCodes = {}
    count = 0;
    recycle_layer = model.layers["RecycledObject"]
    recycle_data = definitions.flat_map(&:instances).select { |instance| instance.layer == recycle_layer}
    countRecycled = recycle_data.size;
    conf.each do |conf_mat|
      mat_name = conf_mat["materialName"]
      total_cubic_meters = 0;
      layer = model.layers[mat_name]
      next if layer.nil?
      desired_data = definitions.flat_map(&:instances).select { |instance| instance.layer == layer}
      #puts "Component: "
      components = desired_data.grep(Sketchup::ComponentInstance)
      components.concat(desired_data.grep(Sketchup::Group))
      components.each do |entity|
        total_cubic_meters += self.cubic_inches_to_cubic_meters(entity.volume).round(5)
        count += 1;

        if dic_colorCodes.key?(conf_mat["colorCode"])
          dic_colorCodes[conf_mat["colorCode"]] += 1;
        else
          dic_colorCodes[conf_mat["colorCode"]] = 1;
        end
      end
      dic_mats[mat_name] = total_cubic_meters.round(5)
    end
    dic_StatisticsMats = {}
    index = 0;
    dic_mats.each do |key, value|
       conf_mat = conf.find { |m| m["materialName"] == key }
       thickness_in_meters = (conf_mat["thickness"].to_f / 1000);
       ecoCost = Math.square_meter_to_volume(1, conf_mat["ecoCost"].to_f,thickness_in_meters) * dic_mats[key.to_s];
       co2eq = Math.square_meter_to_volume(1, conf_mat["cO2"].to_f,thickness_in_meters) * dic_mats[key.to_s];
       dic_StatisticsMats[index.to_s] = { "materialName" => key, "volume" => value.round(5), "colorCode" => conf_mat["colorCode"], "ecoCost" => ecoCost.round(8), "co2eq" => co2eq.round(8) }
       index += 1;
    end
    return {"statisticsMats" => dic_StatisticsMats, "colorCode" => dic_colorCodes, "recycledObjects" => countRecycled, "countObjs" => count}
  end
end
