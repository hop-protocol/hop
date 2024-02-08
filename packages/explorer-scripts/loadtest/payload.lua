wrk.method = "GET"
wrk.headers["Accept"] = "application/json"

logfile = io.open("wrk.log", "w")

response = function(status, header, body)
  str = "status:" .. status .. "\n" .. body .. "\n-------------------------------------------------\n"
  print(str)
  logfile:write(str);
end
