-----------------------------------------------------------------------------------------------------------------------------------------
-- VRP
-----------------------------------------------------------------------------------------------------------------------------------------
local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")
-----------------------------------------------------------------------------------------------------------------------------------------
-- CONEXÃO
-----------------------------------------------------------------------------------------------------------------------------------------
src = {}
Tunnel.bindInterface("alpha_phone",src)
vSERVER = Tunnel.getInterface("alpha_phone")

activeCalls = {}
myStream = false;

RegisterNetEvent("alpha-iphone:loadData")
AddEventHandler("alpha-iphone:loadData", function(phoneNumber, contacts, messages)
  SendNUIMessage({type = "load", phoneNumber = phoneNumber, contacts = contacts, messages = messages})
  SendNUIMessage({type = "open"})
  SetNuiFocus(true, true);
end)


RegisterNUICallback("closeNui", function(data)
    if data.action == "closeNui" then
        closeNui()
    end
end);

RegisterNUICallback("sendMessage", function(data)
    if data.action == "sendMessage" then
        if (data.type == "location") then
            local x,y,z = vRP.getPosition();
            TriggerServerEvent('alpha-phone:createMessage', data.transmitter, data.receiver, x .. "," .. y .. "," .. z, "location")
        else
            TriggerServerEvent('alpha-phone:createMessage', data.transmitter, data.receiver, data.message, "message")
        end
    end
end);


RegisterNUICallback("markLocation",function(data)
	SetNewWaypoint(data.x+0.0001,data.y+0.0001)
end)

RegisterNUICallback("startCall", function(data, cb)
    CreateMobilePhone(1)
    TriggerServerEvent('alpha-phone:startCall', data)
end)


RegisterNUICallback("newIceCandidateCaller", function(data, cb)
    TriggerServerEvent('alpha-phone:newIceCandidateCaller', data)
end)

RegisterNUICallback("newIceCandidateWatcher", function(data, cb)
    TriggerServerEvent('alpha-phone:newIceCandidateWatcher', data)
end)

RegisterNUICallback("sendRTCOffer", function(data, cb)
    TriggerServerEvent('alpha-phone:sendRTCOffer', data)
end)

RegisterNUICallback("joinStream", function(data, cb)
    TriggerServerEvent('alpha-phone:joinStream', data)
end)

RegisterNUICallback("sendRTCAnswer", function(data, cb)
    TriggerServerEvent('alpha-phone:sendRTCAnswer', data)
end)


RegisterNetEvent("alpha-iphone:newCall")
AddEventHandler("alpha-iphone:newCall", function(data)
    activeStreams[data.streamId] = true;
end)

RegisterNetEvent("alpha-iphone:newIceCandidateCaller")
AddEventHandler("alpha-iphone:newIceCandidateCaller", function(data)
    SendNUIMessage({type ="icecandidatestreamer", streamId = data.streamId, candidate = data.candidate});
end)


RegisterNetEvent("alpha-iphone:newIceCandidateWatcher")
AddEventHandler("alpha-iphone:newIceCandidateWatcher", function(data)
    if (myStream == data.streamId) then
        SendNUIMessage({type = "icecandidatewatcher", streamId = data.streamId, serverid = data.serverid, candidate = data.candidate});
    end
end)


RegisterNetEvent("alpha-iphone:sendRTCOffer")
AddEventHandler("alpha-iphone:sendRTCOffer", function(data)
    SendNUIMessage({type = "receiveoffer", streamId = data.streamId, serverid = data.serverid, offer = data.offer});
end)

RegisterNetEvent("alpha-iphone:sendRTCAnswer")
AddEventHandler("alpha-iphone:sendRTCAnswer", function(data)
    if (myStream == data.streamId) then
        SendNUIMessage({type = "receiveanswer", streamId = data.streamId, serverid = data.serverid, answer = data.answer});
    end
end)


RegisterNetEvent("alpha-iphone:joinStream")
AddEventHandler("alpha-iphone:joinStream", function(data)
    if (myStream == data.streamId) then
        SendNUIMessage({type= "joinstream", streamId = data.streamId, serverid = data.serverid});
    end
end)


function closeNui()
    print('callback');
    SetNuiFocus(false, false)
    vRP._DeletarObjeto()
    vRP._stopAnim(false)
    SendNUIMessage({
        type = 'closeNui'
    })
    ClearPedTasks(PlayerPedId())
end