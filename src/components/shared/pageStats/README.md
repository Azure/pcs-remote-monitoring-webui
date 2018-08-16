PageStats Components
=================================

These are presentational components for page statistics which enable us to maintain consitent appearance across different pages.

### StatSection: 

A presentational component containing one or many StatGroups. By default the StatGroups inside a StatSection are arranged vertically next to each other.
 
### StatGroup: 

A presentational component containing one or many StatPropertys. By default the StatPropertys inside a StatGroup are arranged horizontally next to each other.

### StatProperty: 

A presentational component containing number value, label, and an optional svg and svgClassname. The number value can be of three different sizes- large, medium or small, based on `size` parameter. By default the 'size' will be assigned 'small'.

## Examples: 

```html
<StatSection>
  <StatGroup>
    <StatProperty value="12" label="chillers" svg="./svgPath" svgClassName="exmpleCssClass" size="large"}/>
  </StatGroup>
</StatSection>
```

```html
<StatSection>
  <StatGroup>
    <StatProperty value="12" label="chillers"/>
    <StatProperty value="24" label="trucks"/>
  </StatGroup>
</StatSection>
```
