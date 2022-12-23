# animated-scrollable-tab-view

```javascript

const App = () => {
  return (
     <AnimatedScrollableProvider
      tabs={[
        {title: 'hahahahahahahahahahahaha', content: <ItemContent />},
        {title: 'hahahahahaha', content: <ItemContent />},
        {title: 'hohohohohohohohohohohohohohoho', content: <ItemContent />},
        {title: 'hohohohohohohohohohoh', content: <ItemContent />},
      ]}>
        <AnimatedScrollableTabBar />
        <AnimatedScrollableContent />
    </AnimatedScrollableProvider>
  )
}
```
