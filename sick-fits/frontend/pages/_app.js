import App, { Container } from 'next/app'
import Page from '../components/Page'

class MyApp extends App {
  render() {
    // Next.js way to pass components as props
    const { Component } = this.props;
    return (
      <Container>
        <Page>
          <Component />
        </Page>
      </Container>
    )
  }
}

export default MyApp
