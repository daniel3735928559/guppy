<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />
  <xsl:param name="cursor">\\color{red}{\\cdot}</xsl:param>
  <xsl:param name="cblank">\\color{red}{[?]}</xsl:param>
  <xsl:param name="blank">\\color{blue}{[?]}</xsl:param>
  <xsl:param name="type">latex</xsl:param>

  <xsl:template match="r">
    <xsl:variable select="@ref" name="rr" />
    <xsl:variable select="count(../../b)" name="bs" />
    <xsl:apply-templates select="../../*[name()='c' and position()=$rr+$bs]" />
  </xsl:template>

  <xsl:template match="f">
    <!-- <xsl:choose> -->
    <!--   <xsl:when test="$type='latex' and @current='yes'">\color{#f00}{<xsl:apply-templates select="./b" />}</xsl:when> -->
    <!--   <xsl:when test="$type='latex' and count(./c/e[@current='yes']) > 0">\color{#ccc}{\left[\color{#000}{<xsl:apply-templates select="./b" />}\right]}</xsl:when> -->
    <!--   <xsl:otherwise><xsl:apply-templates select="./b" /></xsl:otherwise> -->
    <!-- </xsl:choose> -->
    <xsl:apply-templates select="./b" />
  </xsl:template>

  <xsl:template match="b">
    <xsl:if test="@p=$type">
      <xsl:apply-templates select="@*|node()"/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="b/text()">
    <xsl:copy-of select="."/>
  </xsl:template>

  <xsl:template match="e">
    <xsl:choose>
      <xsl:when test="$type='latex'">
	<xsl:if test=".='' and count(../*)=1">
	  <xsl:choose>
	    <xsl:when test="@current='yes'"><xsl:value-of select="$cblank" /></xsl:when>
	    <xsl:otherwise><xsl:value-of select="$blank" /></xsl:otherwise>
	  </xsl:choose>
	  <!-- <xsl:value-of select="$blank" /> -->
	</xsl:if>
	<xsl:copy-of select="./text()"/>
      </xsl:when>
      <xsl:otherwise>
	<xsl:copy-of select="./text()"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="/">
    <m>
      <xsl:apply-templates select="@*|node()"/>
    </m>
  </xsl:template>

  <xsl:template match="c">
    <xsl:choose>
      <!-- We need to add brackets if:
	   - type is latex
	   - bracket is "yes"
	   - Either:
	   == We have more than one child and not:
	   ===== three children, e's are empty, and f has is_bracket="yes"
	   == We have one child but not a variable and not a number
      -->
      <!-- <xsl:when test="$type='latex' and @bracket = 'yes' and ((count(./*) != 1) or (count(./*) = 1 and string-length(./e/text()) != 1 and number(./e/text()) != ./e/text()))">\left(<xsl:apply-templates select="@*|node()"/>\right)</xsl:when> -->
      <xsl:when test="$type='latex' and @bracket = 'yes' and
      		      ((count(./*) != 1 and not ((count(./e)=2) and count(./e[string-length(text())=0])=2 and (count(./f)=1) and count(./f/c)=1 and count(./f/c[@is_bracket='yes'])=1)
      		      or (count(./*) = 1 and string-length(./e/text()) != 1 and number(./e/text()) != ./e/text())))">\left(<xsl:apply-templates select="@*|node()"/>\right)</xsl:when>
      <xsl:otherwise><xsl:apply-templates select="@*|node()"/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="@*|node()">
    <xsl:apply-templates select="@*|node()"/>
  </xsl:template>
  
</xsl:stylesheet>
