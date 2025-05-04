export const listEquipment = (valueData) => {
  const dataEquipment = {
    computer: {
      data: valueData.computer,
      path: `https://glpi.ints.org.br/front/computer.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=3&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=&search=Pesquisar&itemtype=Computer&start=0&_glpi_csrf_token=e0e9da03a5a21df88961b7d35547c2fb"
    },
    monitor: {
      data: valueData.monitor,
      path: `https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=3&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=4eaa30266e86e8de4085478cf4b263ec"
    },
    printer: {
      data: valueData.printer,
      path: `https://glpi.ints.org.br/front/printer.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=3&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=&search=Pesquisar&itemtype=Printer&start=0&_glpi_csrf_token=9999b7a56f4d7da3edcad8cf002d1319"
    },
    others: {
      data: valueData.others,
      path: "https://glpi.ints.org.br/front/peripheral.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=",
      base: "&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=3&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=&search=Pesquisar&itemtype=Peripheral&start=0&_glpi_csrf_token=18f51f0c4876433e5b21ba20fc3bb6c8"
    }
  }

  return dataEquipment
}