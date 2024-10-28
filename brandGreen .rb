# my_plugin_extension.rb

require 'sketchup.rb'
require 'extensions.rb'

module MyPlugin
  PLUGIN_NAME = 'BrandGreen'.freeze
  PLUGIN_VERSION = '1.0.0'.freeze
  PLUGIN_DESCRIPTION = 'This Plugin Performs calculations and reports on the environmental effect of different materials.'.freeze

  extension = SketchupExtension.new(PLUGIN_NAME, 'BrandGreen/main')
  extension.version = PLUGIN_VERSION
  extension.description = PLUGIN_DESCRIPTION
  extension.creator = "Informage Studios"
  extension.copyright= "2024 By Informage Studios"
  Sketchup.register_extension(extension, true)
end
