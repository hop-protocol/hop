cat docs/README.md | perl -p -e 's/\((#.*?)\)/(https:\/\/docs.hop.exchange\/js-sdk\1)/g' > /tmp/README.md
