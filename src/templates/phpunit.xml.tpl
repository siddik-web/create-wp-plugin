<?xml version="1.0" encoding="UTF-8"?>
<phpunit
  bootstrap="tests/bootstrap.php"
  colors="true"
  convertErrorsToExceptions="true"
  convertNoticesToExceptions="true"
  convertWarningsToExceptions="true"
  stopOnFailure="false"
  verbose="true"
>
  <testsuites>
    <testsuite name="unit">
      <directory>tests/unit</directory>
    </testsuite>
    <testsuite name="integration">
      <directory>tests/integration</directory>
    </testsuite>
  </testsuites>

  <coverage>
    <include>
      <directory suffix=".php">src</directory>
    </include>
  </coverage>
</phpunit>
