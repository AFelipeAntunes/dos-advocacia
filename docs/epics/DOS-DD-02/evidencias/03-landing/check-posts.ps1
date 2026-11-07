$posts = @(
  'https://www.dosadvocacia.com.br/post/im%C3%B3vel-sem-habite-se-riscos-jur%C3%ADdicos-que-o-comprador-precisa-conhecer',
  'https://www.dosadvocacia.com.br/post/fraude-%C3%A0-execu%C3%A7%C3%A3o-no-im%C3%B3vel-o-risco-que-pode-te-custar-tudo',
  'https://www.dosadvocacia.com.br/post/compra-de-im%C3%B3vel-em-invent%C3%A1rio-riscos-que-ningu%C3%A9m-te-conta'
)
foreach ($u in $posts) {
  try {
    $r = Invoke-WebRequest -Uri $u -Method Get -MaximumRedirection 0 -TimeoutSec 30
    Write-Output "$($r.StatusCode) NO_REDIRECT $u"
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      $code = [int]$resp.StatusCode
      $loc = $resp.Headers['Location']
      Write-Output "$code REDIRECT=$loc $u"
    } else {
      Write-Output "ERR $u $($_.Exception.Message)"
    }
  }
}
