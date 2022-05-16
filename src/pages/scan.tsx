import Head from 'next/head'
import React from 'react'

export default function scan() {
    return (
        <div>
            <Head>
                <script type="text/javascript" src="/scannerjs/scanner.js"></script>
            </Head>
            <main>
                hey scanners
            </main>
        </div>
    )
}
