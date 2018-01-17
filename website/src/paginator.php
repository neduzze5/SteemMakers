<?php
 
class Paginator
{
	private $database;
	private $maxNofItems;
	private $currentPageIndex;
	private $query;
	private $nofItems;
	private $startIndex;

	public function __construct( $database, $query ) 
	{
		$this->database = $database;
		$this->query = $query;

		$queryResult = $this->database->select( $this->query );
		$this->nofItems = sizeof($queryResult);
	}

	public function getData( $maxNofItems = 10, $currentPageIndex = 1 )
	{
		$this->maxNofItems = $maxNofItems;
		$this->currentPageIndex = $currentPageIndex;

		if ( $this->maxNofItems == 'all' )
		{
			$query = $this->query;
		}
		else
		{
			$this->startIndex = (($this->currentPageIndex - 1 ) * $this->maxNofItems);
			$query = $this->query . " LIMIT {$this->startIndex}, $this->maxNofItems";
		}
		
		$queryResult = $this->database->query($query) or die($this->database->error());

		while($row = $queryResult->fetch_assoc())
		{
			$results[] = $row; 
		}

		$result = new stdClass();
		$result->currentPageIndex = $this->currentPageIndex;
		$result->maxNofItems = $this->maxNofItems;
		$result->nofItems = $this->nofItems;
		$result->data = $results;

		return $result;
	}

	public function createLinks( $nofLinks) 
	{
		if ( $this->maxNofItems == 'all' ) {
			return '';
		}

		$lastPageIndex = ceil( $this->nofItems / $this->maxNofItems );

		$startIndex = ( ( $this->currentPageIndex - $nofLinks ) > 0 ) ? ($this->currentPageIndex - $nofLinks) : 1;
		$endIndex = ( ( $this->currentPageIndex + $nofLinks ) < $lastPageIndex ) ? ($this->currentPageIndex + $nofLinks) : $lastPageIndex;

		$html = '<ul class="pagination">';

		if( $this->currentPageIndex == 1 )
		{
			$html .= '<li class="page-item disabled"><a class="page-link" href="">&laquo;</a></li>';
		}
		else
		{
			$html .= '<li class="page-item"><a class="page-link" href="?limit=' . $this->maxNofItems . '&page=' . ( $this->currentPageIndex - 1 ) . '">&laquo;</a></li>';
		}

		if ( $startIndex > 1 )
		{
			$html .= '<li class="page-item"><a class="page-link" href="?limit=' . $this->maxNofItems . '&page=1">1</a></li>';
			$html .= '<li class="page-item disabled"><span class="page-link">...</span></li>';
		}

		for ( $i = $startIndex ; $i <= $endIndex; $i++ )
		{
			$class = ( $this->currentPageIndex == $i ) ? "active" : "";
			$html .= '<li class="page-item ' . $class . '"><a class="page-link" href="?limit=' . $this->maxNofItems . '&page=' . $i . '">' . $i . '</a></li>';
		}

		if ( $endIndex < $lastPageIndex )
		{
			$html .= '<li class="page-item disabled"><span class="page-link">...</span></li>';
			$html .= '<li class="page-item"><a class="page-link" href="?limit=' . $this->maxNofItems . '&page=' . $lastPageIndex . '">' . $lastPageIndex . '</a></li>';
		}
		
		if( $this->currentPageIndex == $lastPageIndex)
		{
			$html .= '<li class="page-item disabled"><a class="page-link" href="">&raquo;</a></li>';
		}
		else
		{
			$html .= '<li class="page-item"><a class="page-link" href="?limit=' . $this->maxNofItems . '&page=' . ( $this->currentPageIndex + 1 ) . '">&raquo;</a></li>';
		}

		$html .= '</ul>';
		
		return $html;
	}
}
?>