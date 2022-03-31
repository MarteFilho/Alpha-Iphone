-----------------------------------------------------------------------------------------------------------------------------------------
-- VRP
-----------------------------------------------------------------------------------------------------------------------------------------
local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP","alpha_phone")
vRPAlphaServer = {}
Tunnel.bindInterface("alpha_phone",vRPAlphaServer)
Proxy.addInterface("alpha_phone",vRPAlphaServer)
-----------------------------------------------------------------------------------------------------------------------------------------

RegisterCommand('alpha-phone', function(source, args, rawCommand)

	exports['screenshot-basic-record']:requestClientVideo(GetPlayers()[1], {
		fileName = 'cache/screenshot.webm',
		encoding = 'webm',
		duration = 10000,
		quality = 1.0
	}, function(err, data)
		print('err', err)
		print('data', data)
	end)

    local userId = vRP.getUserId(source);
	local phoneNumber = getNumberPhone(userId);
    local messages = getMessages(userId)
	local contacts = getContacts(userId);
    TriggerClientEvent("alpha-iphone:loadData", source, phoneNumber, contacts, messages);
end)

RegisterServerEvent('alpha-phone:createMessage')
AddEventHandler('alpha-phone:createMessage', function(transmitter, receiver, message, type)
	createMessage(transmitter, receiver, message, 0, type);
	createMessage(receiver, transmitter, message, 1, type);

	local userId = vRP.getUserId(source);
	local phoneNumber = getNumberPhone(userId);
    local messages = getMessages(userId)
	local contacts = getContacts(userId);
    TriggerClientEvent("alpha-iphone:loadData", source, phoneNumber, contacts, messages);

end)


RegisterServerEvent('alpha-phone:startCall')
AddEventHandler('alpha-phone:startCall', function(data)
	TriggerClientEvent("alpha-phone:newCall", -1, data)
end)

RegisterServerEvent('alpha-phone:newIceCandidateCaller')
AddEventHandler('alpha-phone:newIceCandidateCaller', function(data)
	TriggerClientEvent("alpha-phone:newIceCandidateCaller", data.serverId, data)
end)

RegisterServerEvent('alpha-phone:newIceCandidateWatcher')
AddEventHandler('alpha-phone:newIceCandidateWatcher', function(data)
	TriggerClientEvent("alpha-phone:newIceCandidateWatcher", -1, data)
end)

RegisterServerEvent('alpha-phone:sendRTCAnswer')
AddEventHandler('alpha-phone:sendRTCAnswer', function(data)
	TriggerClientEvent("alpha-phone:sendRTCAnswer", data.serverId, data)
end)


RegisterServerEvent('alpha-phone:sendRTCOffer')
AddEventHandler('alpha-phone:sendRTCOffer', function(data)
	TriggerClientEvent("alpha-phone:sendRTCOffer", data.serverId, data)
end)

RegisterServerEvent('alpha-phone:joinStream')
AddEventHandler('alpha-phone:joinStream', function(data)
	TriggerClientEvent("alpha-phone:joinStream", data.serverId, data)
end)



function getNumberPhone(identifier)
	local result = MySQL.Sync.fetchAll("SELECT vrp_user_identities.phone FROM vrp_user_identities WHERE vrp_user_identities.user_id = @identifier",{ ['@identifier'] = identifier })
	if result[1] ~= nil then
		return result[1].phone
	end
	return nil
end

function getContacts(identifier)
	local result = MySQL.Sync.fetchAll("SELECT * FROM phone_users_contacts WHERE phone_users_contacts.identifier = @identifier",{ ['@identifier'] = identifier })
	return result
end

function createMessage(transmitter, receiver, message, owner, type)
	local Query = "INSERT INTO phone_messages (`transmitter`,`receiver`,`message`,`isRead`,`owner`, `type`) VALUES(@transmitter,@receiver,@message,@isRead,@owner,@type);"
	local Query2 = 'SELECT * from phone_messages WHERE `id` = (SELECT LAST_INSERT_ID());'
	local Parameters = {
		['@transmitter'] = transmitter,
		['@receiver'] = receiver,
		['@message'] = message,
		['@isRead'] = owner,
		['@owner'] = owner,
		['@type'] = type
	}
	return MySQL.Sync.fetchAll(Query .. Query2,Parameters)[1]
end

function getMessages(identifier)
	local result = MySQL.Sync.fetchAll("SELECT phone_messages.*, vrp_user_identities.name FROM phone_messages LEFT JOIN vrp_user_identities ON vrp_user_identities.user_id = @identifier WHERE phone_messages.receiver = vrp_user_identities.phone",{ ['@identifier'] = identifier })
	return result
end