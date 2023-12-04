wrk.method = "POST"
wrk.headers["Content-Type"] = "application/json"
wrk.headers["Accept-Encoding"] = "gzip"

-- arbitrum logs request
wrk.body = "{\"jsonrpc\":\"2.0\",\"id\":2174,\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"0x8d05c52\",\"toBlock\":\"0x8d05c52\",\"address\":\"0x3749c4f034022c39ecaffaba182555d4508caccc\",\"topics\":[\"0xe35dddd4ea75d7e9b3fe93af4f4e40e778c3da4074c9d93e7c6536f1e803c1eb\",\"0xe0aac768287ec7fc77986c67d0ca495c56d32fbc1a190b5d128b11eb2ec8e619\",\"0x0000000000000000000000000000000000000000000000000000000000000001\",\"0x000000000000000000000000b35bba6fa684de5ed5bc2666373778365231c9bd\"]}]}"
-- wrk.headers["X-Forwared-For"] = "127.0.0.1"

logfile = io.open("wrk.log", "w")

response = function(status, header, body)
  str = "status:" .. status .. "\n" .. body .. "\n-------------------------------------------------\n"
  print(str)
  print(#body) -- print size
  logfile:write(str);
end
