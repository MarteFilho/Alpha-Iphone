
fx_version "adamant"
game "gta5"
ui_page "nui/index.html"
ui_page_preload 'yes'
client_scripts {
	"@vrp/lib/utils.lua",
	"client.lua"
}
server_scripts {
	"@vrp/lib/utils.lua",
	"server.lua",
	'@mysql-async/lib/MySQL.lua',
}
files {
	"module/*.js",
    "module/animation/tracks/*.js",
    "module/animation/*.js",
    "module/audio/*js",
    "module/cameras/*.js",
    "module/core/*.js",
    "module/extras/core/*.js",
    "module/extras/curves/*.js",
    "module/extras/objects/*.js",
    "module/extras/*.js",
    "module/geometries/*.js",
    "module/helpers/*.js",
    "module/lights/*.js",
    "module/loaders/*.js",
    "module/materials/*.js",
    "module/math/interpolants/*.js",
    "module/math/*.js",
    "module/objects/*.js",
    "module/renderers/shaders/*.js",
    "module/renderers/shaders/ShaderChunk/*.js",
    "module/renderers/shaders/ShaderLib/*.js",
    "module/renderers/webgl/*.js",
    "module/renderers/webxr/*.js",
    "module/renderers/webvr/*.js",
    "module/renderers/*.js",
    "module/scenes/*.js",
    "module/textures/*.js",
	
	"nui/index.html",
	"nui/js/script.js",
	"nui/css/style.css",
	"nui/css/bootstrap.min.css",
	"nui/fonts/*.woff",
	"nui/fonts/sanfrancicoregular.otf",
	"nui/fonts/*.ttf",
	"nui/fonts/*.otf",
}

exports {
    "requestScreenshot"
}