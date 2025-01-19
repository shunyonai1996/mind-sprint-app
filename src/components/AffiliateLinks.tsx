export default function AffiliateLinks() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-primary">おすすめ商品</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="https://www.amazon.co.jp/dp/4478064784"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-300"
          >
            「0秒思考」書籍
          </a>
        </li>
        <li>
          <a
            href="https://www.amazon.co.jp/dp/B07L8RLZGF"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-300"
          >
            おすすめのペン
          </a>
        </li>
        <li>
          <a
            href="https://www.amazon.co.jp/dp/B08JLMN598"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-300"
          >
            おすすめのノート
          </a>
        </li>
      </ul>
    </div>
  )
}

