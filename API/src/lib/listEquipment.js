export const listEquipment = (valueData) => {
  const dataEquipment = {
    computer: {
      data: valueData.computer,
      path: `https://glpi.ints.org.br/front/computer.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&search=Pesquisar&itemtype=Computer&start=0&_glpi_csrf_token=aac8fcd6823684fd0d7cbd81371040c5"
    },
    monitor: {
      data: valueData.monitor,
      path: `https://glpi.ints.org.br/front/monitor.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&search=Pesquisar&itemtype=Monitor&start=0&_glpi_csrf_token=edce4a4ab3bcf593df49163c028837ef"
    },
    printer: {
      data: valueData.printer,
      path: `https://glpi.ints.org.br/front/printer.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=`,
      base: "&search=Pesquisar&itemtype=Printer&start=0&_glpi_csrf_token=6f6d1473e2c579e94adfd88042e67915"
    },
    others: {
      data: valueData.others,
      path: "https://glpi.ints.org.br/front/peripheral.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=view&criteria%5B0%5D%5Bsearchtype%5D=contains&criteria%5B0%5D%5Bvalue%5D=",
      base: "&search=Pesquisar&itemtype=Peripheral&start=0&_glpi_csrf_token=cc36fbca17aa0ec44061d86f622e0d7b"
    }
  }

  return dataEquipment
}